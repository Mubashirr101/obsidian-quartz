---
tags: [python, advanced, descriptors]
aliases: [Python Descriptors, "__get__", "__set__"]
---

# Descriptors

A descriptor is an object that customizes what happens when an attribute is accessed, set, or deleted on ANOTHER class, by implementing `__get__`, `__set__`, and/or `__delete__`. It is the mechanism that powers `@property`, methods, and `@staticmethod`/`@classmethod` under the hood.

## Why This Matters

> [!info] You already use descriptors constantly
> `@property` is literally implemented as a descriptor. Understanding descriptors demystifies a lot of "magic" behavior in Python, including how instance methods automatically receive `self`.

## A Basic Descriptor

```python
class PositiveNumber:
    def __set_name__(self, owner, name):
        self.name = "_" + name           # where to actually store the value

    def __get__(self, instance, owner):
        if instance is None:
            return self
        return getattr(instance, self.name)

    def __set__(self, instance, value):
        if value <= 0:
            raise ValueError(f"{self.name} must be positive")
        setattr(instance, self.name, value)

class Circle:
    radius = PositiveNumber()      # descriptor instance, shared across the class

    def __init__(self, radius):
        self.radius = radius        # goes through PositiveNumber.__set__

c = Circle(5)
c.radius          # 5, goes through PositiveNumber.__get__
c.radius = -3        # raises ValueError, validation happens automatically
```

> [!tip] This is exactly what `@property` does for you, with less boilerplate
> For simple per-attribute validation on a SINGLE class, `@property` (see [[Encapsulation-and-Properties]]) is simpler. Descriptors shine when you need the SAME validation logic reused across MANY different classes/attributes, since one descriptor class can be attached to any number of attributes.

## Data vs Non-Data Descriptors

- **Data descriptor**: implements `__set__` (and/or `__delete__`), takes priority over instance `__dict__`.
- **Non-data descriptor**: implements only `__get__`. Instance `__dict__` takes priority over it.

Regular functions are non-data descriptors, which is precisely why `instance.method()` works: Python looks up `method` on the class, finds the function object, and its `__get__` returns a bound method with `self` already attached.

```python
class Demo:
    def method(self):
        pass

Demo.method             # <function Demo.method at 0x...>, the plain function
Demo().method              # <bound method Demo.method of <...>>, self already bound via __get__
```

## `__set_name__`: Knowing Your Own Attribute Name

Introduced in Python 3.6, called automatically when the descriptor is assigned as a class attribute, letting it know what name it was given without the class author repeating it manually.

```python
class Circle:
    radius = PositiveNumber()     # __set_name__ automatically receives owner=Circle, name='radius'
```

## When You'd Actually Write One

> [!tip] Realistic use cases
> - A validation library reusing the same "must be positive", "must be a valid email", etc, checks across dozens of model classes (this is literally how Django's model fields and Pydantic-style validators work internally).
> - Lazy-loading an expensive attribute the first time it's accessed, shared across many classes.
> - Logging every access to a particular attribute across an entire codebase.

For everyday application code, reaching for `@property` is almost always sufficient. Descriptors are worth understanding conceptually even if you rarely write one from scratch.
