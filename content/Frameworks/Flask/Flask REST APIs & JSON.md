---
title: Flask REST APIs & JSON
tags: [flask, python, rest-api, json, api, cheatsheet]
aliases: [Flask API, Flask-RESTful, Flask JSON API]
status: evergreen
---

# Flask REST APIs & JSON

## 🌐 REST method conventions

| Method | Meaning | Example |
|---|---|---|
| GET | retrieve | `GET /api/users` |
| POST | create | `POST /api/users` |
| PUT | replace entirely | `PUT /api/users/42` |
| PATCH | partial update | `PATCH /api/users/42` |
| DELETE | remove | `DELETE /api/users/42` |

## 🏗️ Basic CRUD

```python
from flask import jsonify, request, abort

@app.route("/api/users", methods=["GET"])
def get_users():
    return jsonify(users)

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = next((u for u in users if u["id"] == user_id), None)
    if user is None:
        abort(404)
    return jsonify(user)

@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "name required"}), 400
    new_user = {"id": len(users)+1, "name": data["name"]}
    users.append(new_user)
    return jsonify(new_user), 201    # 201 = Created, return the new resource

@app.route("/api/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    global users
    users = [u for u in users if u["id"] != user_id]
    return "", 204    # 204 = No Content
```

## 🗄️ With SQLAlchemy model

```python
@app.route("/api/users/<int:user_id>")
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

class User(db.Model):
    def to_dict(self):
        return {"id": self.id, "username": self.username, "email": self.email}
```
> [!tip] `to_dict()` on the model = control exactly what's exposed (keep password_hash out).

## 📚 Marshmallow (structured serialization, bigger APIs)

```bash
pip install flask-marshmallow marshmallow-sqlalchemy
```
```python
from flask_marshmallow import Marshmallow
ma = Marshmallow(app)

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True

users_schema = UserSchema(many=True)
return jsonify(users_schema.dump(users))
```

## 🔑 Token auth

```python
from functools import wraps

def require_api_key(f):
    @wraps(f)
    def wrapper(*a, **kw):
        if request.headers.get("X-API-Key") != "expected-key":
            return jsonify({"error": "Invalid API key"}), 401
        return f(*a, **kw)
    return wrapper

@app.route("/api/protected")
@require_api_key
def protected():
    return jsonify({"message": "access granted"})
```
> [!note] Real production APIs typically use JWT (`flask-jwt-extended`) instead of a shared key.

## 🌍 CORS

```bash
pip install flask-cors
```
```python
from flask_cors import CORS
CORS(app)                                       # any origin — dev only
CORS(app, origins=["https://myfrontend.com"])       # restricted — production
```

## 🔗 Next

[[Flask Error Handling & Logging]] · [[Flask Testing & Deployment]]
