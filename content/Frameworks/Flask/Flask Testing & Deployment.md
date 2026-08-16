---
title: Flask Testing & Deployment
tags: [flask, python, testing, deployment, gunicorn, pytest, cheatsheet]
aliases: [Flask pytest, Flask Gunicorn, Flask Production]
status: evergreen
---

# Flask Testing & Deployment

## 🧪 Test client setup

```python
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app(TestingConfig)
    with app.test_client() as client:
        yield client
```
```python
class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    WTF_CSRF_ENABLED = False   # skip CSRF friction in tests
```

## ✅ Writing tests

```python
def test_home_page(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"Welcome" in response.data      # response.data is bytes, use b"..."

def test_create_user(client):
    response = client.post("/api/users", json={"username": "amit"})   # json= auto-sets Content-Type
    assert response.status_code == 201
    assert response.get_json()["username"] == "amit"

def test_dashboard_requires_login(client):
    assert client.get("/dashboard").status_code == 401

def test_dashboard_with_login(client):
    client.post("/login", data={"username": "amit", "password": "secret"})
    assert client.get("/dashboard").status_code == 200   # cookies persist across requests on same client
```

## 🗄️ Fresh DB per test

```python
@pytest.fixture
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()
```

## 🏃 Running tests

```bash
pip install pytest
pytest              # all tests
pytest -v              # verbose
pytest tests/test_api.py   # one file
pytest -k "test_login"        # match by name
```

## 🚀 Deployment stack

```
Nginx (reverse proxy, serves static, HTTPS) → Gunicorn (WSGI, multiple workers) → Flask app
```
> [!warning] `app.run()` is single-threaded dev server. Never use in production. See [[Flask Basics & Application Setup]].

## 🦄 Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 "app:create_app()"
```
`-w 4` = 4 worker processes. Rough formula: `(2 × CPU cores) + 1`.

## 🌐 Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name myapp.com;

    location /static/ {
        alias /path/to/myproject/app/static/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
> [!tip] Static files served directly by Nginx, not Flask — much faster.

## 🐳 Dockerized deployment

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:create_app()"]
```

## ✅ Pre-launch checklist

- `DEBUG = False`
- `SECRET_KEY` = long random value from env var, not hardcoded
- No secrets committed to version control
- `SESSION_COOKIE_SECURE = True` if serving HTTPS
- Error handlers return generic messages, log full detail server-side (see [[Flask Error Handling & Logging]])

## 🔗 Back to

[[Flask]]
