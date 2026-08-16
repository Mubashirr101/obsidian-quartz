---
title: Flask Request & Response Objects
tags: [flask, python, request, response, http, cheatsheet]
aliases: [Flask request object, Flask jsonify]
status: evergreen
---

# Flask Request & Response Objects

## 📥 request object

```python
from flask import request

request.args.get("page")             # query string param, None if missing
request.args.get("page", 1)             # with default
request.args.get("page", type=int)         # with type conversion
request.args.getlist("tag")                   # repeated ?tag=x&tag=y

request.form.get("email")            # form (POST) data

request.get_json()                   # parsed JSON body (needs Content-Type: application/json)

request.method                       # "GET", "POST", etc.
request.headers.get("User-Agent")       # a header
request.cookies                          # cookies dict
request.files                               # uploaded files (see Flask File Uploads & Caching)
request.url / request.path                    # full URL / just the path
request.remote_addr                               # client IP
```

> [!tip] Always use `.get()`, never `request.args["x"]` — raises an error if missing.

> [!warning] `get_json()` returns `None` (not error) if Content-Type header is wrong, unless `force=True`.

## 📤 Response shapes

```python
return "Hello"                        # 200, text/html
return "Nothing here", 404               # tuple → sets status code
return "Body", 404, {"X-Custom": "1"}       # tuple → status + headers

from flask import jsonify
return jsonify({"status": "ok"})              # JSON, correct Content-Type set automatically
return {"status": "ok"}                          # plain dict also auto-converts to JSON (Flask 1.1+)

from flask import Response
r = Response("body", status=200, mimetype="text/plain")
r.headers["X-Custom-Header"] = "value"
return r
```

> [!tip] Prefer `jsonify()` over manual `json.dumps()` — sets Content-Type correctly.

## ↩️ abort()

```python
from flask import abort
abort(403)   # immediately stops execution, triggers error handler (see Flask Error Handling & Logging)
```

## 🧮 Status codes cheat table

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 301/302 | Redirect |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔗 Next

[[Flask Forms & WTForms]] · [[Flask REST APIs & JSON]]
