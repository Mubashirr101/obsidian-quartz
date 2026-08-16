---
title: Flask Templates (Jinja2)
tags: [flask, python, jinja2, templates, html, cheatsheet]
aliases: [Jinja2, Flask render_template]
status: evergreen
---

# Flask Templates (Jinja2)

## 📁 Setup

```
myproject/
├── app.py
└── templates/
    └── home.html
```

```python
from flask import render_template

@app.route("/")
def home():
    return render_template("home.html", title="Welcome", user="Amit")
```

## 🔤 Variables and expressions

```jinja2
{{ variable }}
{{ user.name }}              {# attribute access #}
{{ user['name'] }}              {# bracket, same result #}
{{ items[0] }}                     {# indexing #}
{{ price * 1.1 }}                     {# arithmetic #}
{{ "Yes" if logged_in else "No" }}       {# inline conditional #}
```

> [!tip] Missing attribute → renders blank, doesn't crash. Watch for silent typos.

## 🔁 Control structures

```jinja2
{% if user.is_admin %}
    admin
{% elif user.is_member %}
    member
{% else %}
    guest
{% endif %}

{% for item in items %}
    {{ loop.index }}: {{ item.name }}
{% else %}
    no items          {# runs if items is empty #}
{% endfor %}
```

| loop.attr | Meaning |
|---|---|
| `loop.index` | 1-based iteration count |
| `loop.index0` | 0-based |
| `loop.first` / `loop.last` | boolean |
| `loop.length` | total items |

## 🧱 Template inheritance

```html
<!-- base.html -->
<title>{% block title %}My Site{% endblock %}</title>
<main>{% block content %}{% endblock %}</main>
```
```html
<!-- home.html -->
{% extends "base.html" %}
{% block title %}Home{% endblock %}
{% block content %}<h1>Welcome</h1>{% endblock %}
```

> [!warning] `{% extends %}` must be the first line in the child template.

## 🧩 Includes

```jinja2
{% include "partials/navbar.html" %}
```
`include` = paste a fragment in place. `extends` = override blocks in a shared layout.

## 🔗 Linking

```jinja2
<a href="{{ url_for('about') }}">About</a>
<a href="{{ url_for('static', filename='style.css') }}">CSS</a>
```

## 🧹 Filters

```jinja2
{{ name | upper }}
{{ name | lower }}
{{ description | truncate(50) }}
{{ items | length }}
{{ price | round(2) }}
{{ user.bio | default("No bio") }}
{{ name | trim | upper }}          {# chainable #}
```

## 🛡️ Auto-escaping

```jinja2
{{ user_comment }}          {# escaped by default, safe #}
{{ trusted_html | safe }}      {# disables escaping #}
```

> [!warning] Only use `| safe` on content you fully trust. Otherwise = XSS risk.

## 🔗 Next

[[Flask Static Files & Blueprints]] · [[Flask Forms & WTForms]]
