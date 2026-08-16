---
title: Flask Sessions & Cookies
tags: [flask, python, sessions, cookies, state, cheatsheet]
aliases: [Flask session object, Flask cookies]
status: evergreen
---

# Flask Sessions & Cookies

## 🍪 Cookies (raw)

```python
from flask import make_response

response = make_response("OK")
response.set_cookie("username", "amit", max_age=60*60*24*7, httponly=True, secure=True, samesite="Lax")

request.cookies.get("username")   # read
```

> [!warning] Raw cookies are visible + editable by the user. Never store sensitive data in them directly.

## 🔐 session object (signed)

```python
from flask import session
app.config["SECRET_KEY"] = "genuinely-random-string"   # required

session["user_id"] = 42       # set
session.get("user_id")           # read
session.clear()                     # logout / clear all
```

> [!note] Signed ≠ encrypted. Contents are tamper-proof but still readable. Don't store passwords/PII in it.

> [!warning] SECRET_KEY leak = anyone can forge sessions. Keep it in an env var, never hardcoded.

## ⏳ Persistent sessions

```python
from datetime import timedelta
session.permanent = True
app.permanent_session_lifetime = timedelta(days=7)
```
Default: session cookie dies when browser closes.

## 🖥️ Server-side sessions (Flask-Session)

```bash
pip install flask-session
```
```python
from flask_session import Session
app.config["SESSION_TYPE"] = "filesystem"   # or "redis", "sqlalchemy"
Session(app)
```
Use when: data too big for a cookie, or need to force-invalidate a session server-side.

## 🧮 Cookie vs session

| | Plain cookie | Flask session |
|---|---|---|
| Location | Browser | Signed cookie (or server-side) |
| Tamper-proof | No | Yes |
| Typical use | Preferences | Login state, flash messages |

## 💬 Flash messages

```python
from flask import flash
flash("Saved successfully")
```
```jinja2
{% with messages = get_flashed_messages() %}
    {% for m in messages %}<li>{{ m }}</li>{% endfor %}
{% endwith %}
```
> [!tip] Auto one-time-only — cleared the moment they're displayed.

## 🔗 Next

[[Flask Authentication & Login]] · [[Flask Database Integration (SQLAlchemy)]]
