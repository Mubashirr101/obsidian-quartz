---
title: Flask Error Handling & Logging
tags: [flask, python, error-handling, logging, exceptions, cheatsheet]
aliases: [Flask errorhandler, Flask Logging]
status: evergreen
---

# Flask Error Handling & Logging

## 🎯 Custom error handlers

```python
@app.errorhandler(404)
def not_found(error):
    return render_template("errors/404.html"), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()   # clean up any broken transaction
    return render_template("errors/500.html"), 500
```

## 🎨 JSON errors (for an API)

```python
@app.errorhandler(404)
def not_found(error):
    if request.path.startswith("/api/"):
        return jsonify({"error": "Not found"}), 404
    return render_template("errors/404.html"), 404
```

## 🎯 Custom exception → handler

```python
class InsufficientFundsError(Exception):
    def __init__(self, message):
        self.message = message

@app.errorhandler(InsufficientFundsError)
def handle_funds_error(error):
    return jsonify({"error": error.message}), 400

# anywhere in app code:
raise InsufficientFundsError("Not enough funds")
```

## ↩️ abort() with a message

```python
abort(400, description="'email' is required")

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": error.description}), 400
```

## 📝 Logging

```python
app.logger.debug("...")
app.logger.info("...")
app.logger.warning("...")
app.logger.error("...")
app.logger.critical("...")
app.logger.exception("msg")   # inside except block — auto-includes full traceback
```

### File logging w/ rotation

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    handler = RotatingFileHandler("app.log", maxBytes=10240, backupCount=5)
    handler.setLevel(logging.INFO)
    handler.setFormatter(logging.Formatter(
        "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
    ))
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
```

## 🚨 Catch-all handler

```python
@app.errorhandler(Exception)
def handle_unexpected(error):
    app.logger.exception("Unhandled exception")
    return jsonify({"error": "An unexpected error occurred"}), 500
```
> [!warning] Never leak raw exception details to the user. Log full detail server-side, return generic message.

## 🔗 Next

[[Flask Testing & Deployment]]
