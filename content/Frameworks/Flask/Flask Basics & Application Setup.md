---
title: Flask Basics & Application Setup
tags: [flask, python, setup, application, cheatsheet]
aliases: [Flask App Object, Flask Development Server]
status: evergreen
---

# Flask Basics & Application Setup

## 📦 Install

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install flask
pip freeze > requirements.txt
```

> [!tip] Always use a virtual environment. Keeps project deps isolated.

## 🏗️ App object

```python
from flask import Flask
app = Flask(__name__)   # __name__ lets Flask find templates/static relative to this file
```

## 🏃 Run

```python
if __name__ == "__main__":
    app.run(debug=True)                      # default: 127.0.0.1:5000
    app.run(debug=True, host="0.0.0.0", port=8000)   # network-visible, custom port
```

```bash
# alternative CLI method
export FLASK_APP=app.py       # Windows: set FLASK_APP=app.py
export FLASK_DEBUG=1
flask run
```

> [!warning] Dev server ≠ production. See [[Flask Testing & Deployment]] for Gunicorn/Nginx.

> [!warning] `debug=True` enables an interactive debugger that can execute arbitrary code. Never enable in production.

## 🧩 A route, at a glance

```python
@app.route("/")
def home():
    return "Hello, Flask!"    # return value = response body
```

## 🗂️ Minimal project layout

```
myproject/
├── venv/
├── app.py
├── requirements.txt
├── templates/
└── static/
```

## 🔗 Next

[[Flask Routing & URL Building]] · [[Flask Request & Response Objects]]
