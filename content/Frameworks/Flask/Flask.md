---
title: Flask
tags: [flask, python, web-development, moc, index, cheatsheet]
aliases: [Flask Framework, Flask Python]
status: evergreen
---

# Flask

## 🧠 What is Flask

Lightweight Python web framework (microframework). Core = routing + requests + Jinja2 templates. Everything else (DB, auth, forms) via extensions. Built on Werkzeug (WSGI) + Jinja2.

| vs | Difference |
|---|---|
| Django | Django = batteries included, opinionated. Flask = minimal core, pick your own pieces |
| FastAPI | FastAPI = async-first, auto validation/docs via type hints. Flask = sync-first, simpler |

## 📚 Map of Content

- [[Flask Basics & Application Setup]] - install, app object, dev server
- [[Flask Routing & URL Building]] - routes, dynamic segments, url_for
- [[Flask Request & Response Objects]] - request data, response shaping
- [[Flask Templates (Jinja2)]] - rendering HTML, syntax, inheritance
- [[Flask Static Files & Blueprints]] - CSS/JS/images, modular structure
- [[Flask Forms & WTForms]] - form validation, CSRF
- [[Flask Sessions & Cookies]] - state across requests
- [[Flask Database Integration (SQLAlchemy)]] - ORM, models, CRUD, migrations
- [[Flask Authentication & Login]] - Flask-Login, password hashing
- [[Flask REST APIs & JSON]] - JSON APIs, CORS, tokens
- [[Flask Error Handling & Logging]] - errorhandler, logging
- [[Flask Configuration & Application Factory]] - config classes, create_app pattern
- [[Flask Extensions & Middleware]] - before/after/teardown request, g object
- [[Flask File Uploads & Caching]] - uploads, Flask-Caching
- [[Flask Testing & Deployment]] - pytest, Gunicorn, Nginx

## ⚡ Minimal app

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Flask!"

if __name__ == "__main__":
    app.run(debug=True)
```

```bash
pip install flask
python app.py    # → http://127.0.0.1:5000
```
