---
title: Flask Extensions & Middleware
tags: [flask, python, extensions, middleware, hooks, cheatsheet]
aliases: [Flask before_request, Flask after_request, Flask Extensions]
status: evergreen
---

# Flask Extensions & Middleware

## 🧩 Common extensions

| Extension | Purpose |
|---|---|
| Flask-SQLAlchemy | ORM |
| Flask-Migrate | DB migrations |
| Flask-WTF | forms + CSRF |
| Flask-Login | sessions/auth |
| Flask-Mail | send email |
| Flask-CORS | cross-origin requests |
| Flask-Caching | caching |
| Flask-Limiter | rate limiting |
| Flask-Session | server-side sessions |
| Flask-Marshmallow | serialization/validation |

Pattern: `ext = Extension()` then `ext.init_app(app)` — nearly universal across extensions.

### Flask-Mail

```bash
pip install flask-mail
```
```python
from flask_mail import Mail, Message
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
mail = Mail(app)

msg = Message("Welcome!", sender="noreply@myapp.com", recipients=[user_email])
msg.body = "Thanks for signing up."
mail.send(msg)
```

### Flask-Limiter

```bash
pip install flask-limiter
```
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app=app, key_func=get_remote_address, default_limits=["200 per day"])

@app.route("/api/login", methods=["POST"])
@limiter.limit("5 per minute")   # tighter limit on sensitive routes
def login(): ...
```

## 🪝 before_request

```python
@app.before_request
def log_request():
    app.logger.info(f"{request.method} {request.path}")

@app.before_request
def check_maintenance():
    if maintenance_mode() and request.path != "/maintenance":
        return render_template("maintenance.html"), 503   # returning a value short-circuits the actual route
```

## 🪝 after_request

```python
@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    return response   # must return it
```

## 🪝 teardown_request

```python
@app.teardown_request
def close_db(exception=None):
    db = getattr(g, "db_connection", None)
    if db is not None:
        db.close()
```
> [!note] `teardown_request` runs no matter what (even on unhandled exceptions). `after_request` only runs on success.

## 🌐 g object — per-request storage

```python
from flask import g

@app.before_request
def load_user():
    g.user = User.query.get(session.get("user_id"))

@app.route("/profile")
def profile():
    return g.user.username if g.user else "Not logged in"
```
> [!warning] `g` resets on every new request — not for cross-request storage.

## 🧱 WSGI middleware (rare, low-level)

```python
class SimpleMiddleware:
    def __init__(self, app):
        self.app = app
    def __call__(self, environ, start_response):
        print(environ.get("PATH_INFO"))
        return self.app(environ, start_response)

app.wsgi_app = SimpleMiddleware(app.wsgi_app)
```

## 🔗 Next

[[Flask File Uploads & Caching]] · [[Flask Testing & Deployment]]
