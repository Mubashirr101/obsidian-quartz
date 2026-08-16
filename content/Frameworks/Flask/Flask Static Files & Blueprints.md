---
title: Flask Static Files & Blueprints
tags: [flask, python, static-files, blueprints, project-structure, cheatsheet]
aliases: [Flask Blueprint, Flask Static Folder]
status: evergreen
---

# Flask Static Files & Blueprints

## 📁 Static files

```
myproject/
├── app.py
└── static/
    ├── style.css
    └── images/logo.png
```

```html
<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
<img src="{{ url_for('static', filename='images/logo.png') }}">
```

```python
app = Flask(__name__, static_folder="assets", static_url_path="/files")   # customize defaults
```

## 🧩 Blueprints

```python
# blog/routes.py
from flask import Blueprint, render_template

blog_bp = Blueprint("blog", __name__, template_folder="templates")

@blog_bp.route("/")
def index():
    return render_template("blog/index.html")

@blog_bp.route("/<int:post_id>")
def show_post(post_id):
    return render_template("blog/post.html", post_id=post_id)
```

```python
# app.py
from blog.routes import blog_bp
app.register_blueprint(blog_bp, url_prefix="/blog")
```
→ `/blog/` = `index()`, `/blog/42` = `show_post(42)`

```jinja2
{{ url_for('blog.index') }}                 {# blueprint routes need "blueprintname." prefix #}
{{ url_for('blog.show_post', post_id=42) }}
```

> [!warning] Forgetting the `blueprintname.` prefix in `url_for` inside a blueprint = error.

## 🗂️ Layout with blueprints

```
myproject/
├── app.py
├── blog/
│   ├── __init__.py
│   ├── routes.py
│   └── templates/blog/index.html    # nested folder avoids naming collisions
├── auth/
│   ├── __init__.py
│   └── routes.py
└── static/
```

## 🎯 Blueprint-specific static + hooks

```python
blog_bp = Blueprint("blog", __name__, static_folder="static", static_url_path="/blog-static")

@blog_bp.before_request
def check_maintenance():
    if maintenance_mode():
        return "Under maintenance", 503
```

## 🔗 Next

[[Flask Forms & WTForms]] · [[Flask Configuration & Application Factory]]
