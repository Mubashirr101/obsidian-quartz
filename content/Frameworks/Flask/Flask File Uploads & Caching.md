---
title: Flask File Uploads & Caching
tags: [flask, python, file-upload, caching, cheatsheet]
aliases: [Flask-Caching, Flask File Upload]
status: evergreen
---

# Flask File Uploads & Caching

## 📎 Basic upload

```html
<form method="POST" enctype="multipart/form-data">   <!-- required for file uploads -->
    <input type="file" name="photo">
    <button type="submit">Upload</button>
</form>
```

```python
from werkzeug.utils import secure_filename

@app.route("/upload", methods=["POST"])
def upload():
    if "photo" not in request.files:
        return "No file part", 400
    file = request.files["photo"]
    if file.filename == "":
        return "No file selected", 400

    filename = secure_filename(file.filename)   # sanitize — prevents path traversal
    file.save(f"uploads/{filename}")
    return "Uploaded"
```
> [!warning] Never save `file.filename` raw. Always run through `secure_filename()`.

## ✅ Validate type + size

```python
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS

app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024   # 16 MB cap → auto 413 if exceeded
```

## 🗂️ Upload folder + serving back

```python
import os
app.config["UPLOAD_FOLDER"] = os.path.join(app.root_path, "uploads")

from flask import send_from_directory

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
```
> [!tip] `send_from_directory` has built-in path traversal protection + correct content-type headers.

## ⚡ Caching (Flask-Caching)

```bash
pip install flask-caching
```
```python
from flask_caching import Cache
app.config["CACHE_TYPE"] = "SimpleCache"   # in-memory, dev only
cache = Cache(app)
```

### Cache a whole view

```python
@app.route("/expensive-report")
@cache.cached(timeout=300)   # 5 min
def expensive_report():
    data = run_expensive_query()
    return render_template("report.html", data=data)
```

### Cache a specific value

```python
def get_top_products():
    result = cache.get("top_products")
    if result is None:
        result = run_expensive_query()
        cache.set("top_products", result, timeout=600)
    return result
```

### Invalidation

```python
cache.delete("top_products")
cache.clear()
```

### Production backend

```python
app.config["CACHE_TYPE"] = "RedisCache"
app.config["CACHE_REDIS_URL"] = "redis://localhost:6379/0"
```
> [!warning] `SimpleCache` doesn't work across multiple worker processes — use Redis in production.

## 🔗 Next

[[Flask Testing & Deployment]]
