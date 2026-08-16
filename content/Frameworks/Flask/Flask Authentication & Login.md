---
title: Flask Authentication & Login
tags: [flask, python, authentication, flask-login, security, cheatsheet]
aliases: [Flask-Login, Flask User Authentication]
status: evergreen
---

# Flask Authentication & Login

## 📦 Setup

```bash
pip install flask-login werkzeug
```

## 🔒 Password hashing

```python
from werkzeug.security import generate_password_hash, check_password_hash

hashed = generate_password_hash("my-password")
check_password_hash(hashed, "my-password")   # True/False
```
> [!warning] Never store plain-text passwords. Ever.

## 🏗️ User model

```python
from flask_login import UserMixin

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
```
`UserMixin` provides `is_authenticated`, `is_active`, `get_id()` defaults.

## ⚙️ Config

```python
from flask_login import LoginManager

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))
```

## 🔑 Login / logout

```python
from flask_login import login_user, logout_user, login_required, current_user

@app.route("/login", methods=["POST"])
def login():
    user = User.query.filter_by(username=form.username.data).first()
    if user and user.check_password(form.password.data):
        login_user(user, remember=form.remember_me.data)
        return redirect(url_for("dashboard"))
    flash("Invalid username or password")   # generic on purpose, don't leak which part failed

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("home"))
```

## 🛡️ Protecting routes

```python
@app.route("/dashboard")
@login_required
def dashboard():
    return f"Welcome, {current_user.username}"
```

```jinja2
{% if current_user.is_authenticated %}
    {{ current_user.username }}
{% else %}
    <a href="{{ url_for('login') }}">Log in</a>
{% endif %}
```

## 🎭 Role-based access

```python
class User(db.Model, UserMixin):
    role = db.Column(db.String(20), default="user")

from functools import wraps
from flask import abort

def admin_required(f):
    @wraps(f)
    def wrapper(*a, **kw):
        if not current_user.is_authenticated or current_user.role != "admin":
            abort(403)
        return f(*a, **kw)
    return wrapper

@app.route("/admin")
@login_required
@admin_required
def admin_panel():
    return "Admin"
```

## 🔗 Next

[[Flask REST APIs & JSON]] · [[Flask Error Handling & Logging]]
