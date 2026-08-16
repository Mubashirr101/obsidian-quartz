---
title: Flask Configuration & Application Factory
tags: [flask, python, configuration, application-factory, project-structure, cheatsheet]
aliases: [Flask Config, Flask create_app]
status: evergreen
---

# Flask Configuration & Application Factory

## ⚙️ Basic config

```python
app.config["SECRET_KEY"] = "value"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["DEBUG"] = True
```

## 📄 Config classes

```python
# config.py
import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-key-change-me")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
```
```python
app.config.from_object(DevelopmentConfig)
```

### .env file

```bash
pip install python-dotenv
```
```python
from dotenv import load_dotenv
load_dotenv()
```
```
# .env
SECRET_KEY=genuinely-long-random-string
DATABASE_URL=postgresql://user:pass@localhost/mydb
```
> [!warning] Never commit `.env`. Add to `.gitignore`. Commit a `.env.example` instead.

## 🏭 Application factory pattern

```python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()   # created without app

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)   # initialized separately

    from app.blog.routes import blog_bp
    app.register_blueprint(blog_bp, url_prefix="/blog")

    return app
```
```python
# run.py
from app import create_app
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
```

> [!tip] Why bother: lets you spin up a fresh, differently-configured app per test/environment. Essential for testing (see [[Flask Testing & Deployment]]).

## 🗂️ Full factory-based layout

```
myproject/
├── run.py
├── config.py
├── requirements.txt
├── .env
├── .gitignore
└── app/
    ├── __init__.py
    ├── models.py
    ├── blog/
    │   ├── __init__.py
    │   ├── routes.py
    │   └── templates/blog/
    ├── auth/
    ├── templates/base.html
    └── static/
```

## 🌍 Selecting config by environment

```python
import os
env = os.environ.get("FLASK_ENV", "development")
config_class = ProductionConfig if env == "production" else DevelopmentConfig
app = create_app(config_class)
```

## 🧾 Common config keys

| Key | Purpose |
|---|---|
| `SECRET_KEY` | signs sessions/CSRF |
| `SQLALCHEMY_DATABASE_URI` | DB connection string |
| `DEBUG` | debug mode |
| `TESTING` | testing mode |
| `SESSION_COOKIE_SECURE` | HTTPS-only session cookie |
| `PERMANENT_SESSION_LIFETIME` | session duration |
| `MAX_CONTENT_LENGTH` | max request body size |

## 🔗 Next

[[Flask Extensions & Middleware]] · [[Flask Testing & Deployment]]
