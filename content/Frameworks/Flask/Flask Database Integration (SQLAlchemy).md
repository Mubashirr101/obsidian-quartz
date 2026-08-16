---
title: Flask Database Integration (SQLAlchemy)
tags: [flask, python, sqlalchemy, database, orm, cheatsheet]
aliases: [Flask-SQLAlchemy, Flask ORM]
status: evergreen
---

# Flask Database Integration (SQLAlchemy)

## 📦 Setup

```bash
pip install flask-sqlalchemy
```
```python
from flask_sqlalchemy import SQLAlchemy

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///myapp.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
```

| DB | URI |
|---|---|
| SQLite | `sqlite:///myapp.db` |
| PostgreSQL | `postgresql://user:pass@localhost/mydb` |
| MySQL | `mysql://user:pass@localhost/mydb` |

## 🏗️ Model

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
```

| Type | Use |
|---|---|
| `db.Integer` | whole numbers |
| `db.String(n)` | text, max length n |
| `db.Text` | unbounded text |
| `db.Boolean` | True/False |
| `db.DateTime` | date + time |
| `db.Float` | decimal |

## 🗂️ Create tables

```python
with app.app_context():
    db.create_all()
```

## ➕ Create (insert)

```python
new_user = User(username="amit", email="amit@example.com")
db.session.add(new_user)
db.session.commit()
```

## 🔍 Read (query)

```python
User.query.all()
User.query.first()
User.query.get(1)
User.query.get_or_404(1)                              # 404 if missing
User.query.filter_by(username="amit").first()             # exact match shorthand
User.query.filter(User.email.like("%@example.com")).all()    # flexible filter
User.query.order_by(User.username).all()
User.query.limit(10).all()

from sqlalchemy import and_, or_
User.query.filter(and_(User.username=="amit", User.email.like("%@x.com"))).all()
User.query.filter(or_(User.username=="amit", User.username=="sara")).all()
```

## ✏️ Update

```python
user = User.query.filter_by(username="amit").first()
user.email = "new@example.com"
db.session.commit()      # no separate .update() call — just mutate + commit
```

## 🗑️ Delete

```python
db.session.delete(user)
db.session.commit()
```

## 🔗 Relationships

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    posts = db.relationship("Post", backref="author", lazy=True)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
```
```python
user.posts              # all posts by this user
post.author              # backref — the owning user
```

> [!tip] `lazy="joined"` avoids N+1 query issues when looping over relationships at scale.

## 🔄 Migrations (Flask-Migrate)

```bash
pip install flask-migrate
```
```python
from flask_migrate import Migrate
migrate = Migrate(app, db)
```
```bash
flask db init                              # once per project
flask db migrate -m "add email column"        # generate migration
flask db upgrade                                  # apply
flask db downgrade                                    # revert last
```

## 🔗 Next

[[Flask Authentication & Login]] · [[Flask REST APIs & JSON]]
