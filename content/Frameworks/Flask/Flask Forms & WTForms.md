---
title: Flask Forms & WTForms
tags: [flask, python, forms, wtforms, validation, csrf, cheatsheet]
aliases: [Flask-WTF, WTForms]
status: evergreen
---

# Flask Forms & WTForms

## 📦 Setup

```bash
pip install flask-wtf
```
```python
app.config["SECRET_KEY"] = "genuinely-random-string"   # required for CSRF
```

## 🏗️ Form class

```python
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length

class RegistrationForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(), Length(min=3, max=20)])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])
    submit = SubmitField("Register")
```

## 🧾 Field types

```python
StringField, PasswordField, IntegerField, BooleanField,
SelectField(choices=[("us","US"),("in","India")]), TextAreaField, DateField, SubmitField
```

## ✅ Validators

| Validator | Checks |
|---|---|
| `DataRequired()` | not empty |
| `Email()` | valid email format |
| `Length(min=, max=)` | length range |
| `EqualTo("field")` | matches another field (password confirm) |
| `NumberRange(min=, max=)` | numeric range |
| `Optional()` | allow empty |

> [!tip] Custom validator: `def validate_username(self, field):` on the form class, raise `ValidationError`.

## 🖼️ View + template

```python
@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():         # POST + all validators passed
        return f"Registered {form.username.data}"
    return render_template("register.html", form=form)
```

```html
<form method="POST">
    {{ form.hidden_tag() }}      {# required — renders CSRF token #}
    {{ form.username.label }} {{ form.username() }}
    {% for error in form.username.errors %}<span>{{ error }}</span>{% endfor %}
    {{ form.submit() }}
</form>
```

> [!warning] Omit `form.hidden_tag()` → CSRF token missing → submission rejected.

## 🛡️ CSRF

Automatic. Token embedded via `hidden_tag()`, verified on submit. Toggle: `app.config["WTF_CSRF_ENABLED"] = True` (default).

## 🎯 Reading validated data

```python
if form.validate_on_submit():
    username = form.username.data   # already validated + type-converted
```
> [!tip] Read via `.data` after validation, not raw `request.form`.

## 📎 File field

```python
from flask_wtf.file import FileField, FileAllowed, FileRequired

photo = FileField("Photo", validators=[FileRequired(), FileAllowed(["jpg","png"], "Images only")])
```
See [[Flask File Uploads & Caching]] for actually saving the file.

## 🔗 Next

[[Flask Database Integration (SQLAlchemy)]] · [[Flask Sessions & Cookies]]
