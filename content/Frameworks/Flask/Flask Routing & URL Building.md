---
title: Flask Routing & URL Building
tags: [flask, python, routing, url, cheatsheet]
aliases: [Flask Routes, Flask url_for]
status: evergreen
---

# Flask Routing & URL Building

## 🛣️ Basic route

```python
@app.route("/about")
def about():
    return "About page"
```

## 🎯 Dynamic segments + converters

```python
@app.route("/user/<username>")           # string, default
@app.route("/post/<int:post_id>")           # int
@app.route("/price/<float:amount>")            # float
@app.route("/files/<path:filepath>")               # string but allows slashes
```

| Converter | Matches |
|---|---|
| `string` (default) | text, no slash |
| `int` | positive integer |
| `float` | positive float |
| `path` | text incl. slashes |
| `uuid` | UUID format |

> [!tip] Converters auto-validate + auto 404 on mismatch. Free validation.

## 📬 HTTP methods

```python
@app.route("/submit", methods=["GET", "POST"])
def submit():
    if request.method == "POST":
        return "submitted"
    return "form here"
```
Default = `GET` only.

## 🔗 url_for

```python
url_for("about")                        # "/about"
url_for("show_user", username="amit")      # "/user/amit"
url_for("search", query="flask", page=2)      # "/search?query=flask&page=2" (extra kwargs → query string)
```

> [!tip] Always use `url_for` over hardcoded paths — one place to update if a route URL changes.

## 🔀 Redirect

```python
from flask import redirect, url_for
return redirect(url_for("home"))
```

## ⚠️ Trailing slash

```python
@app.route("/projects/")   # /projects → redirects to /projects/
@app.route("/projects")    # /projects/ → 404
```

## 🧾 Multiple routes, one function

```python
@app.route("/")
@app.route("/home")
def home():
    return "Welcome"
```

## 🔗 Next

[[Flask Request & Response Objects]] · [[Flask Templates (Jinja2)]]
