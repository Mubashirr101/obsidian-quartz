---
tags: [python, advanced, metaclasses]
aliases: [Python Metaclasses, type(), "__new__"]
---

# Metaclasses

A metaclass is "the class of a class." Just as a class defines how instances behave, a metaclass defines how CLASSES themselves behave.

> [!tip] "Metaclasses are deeper magic than 99% of users should ever worry about" (Tim Peters)
> This is genuinely advanced material. Most Python code, including most professional codebases, never needs a custom metaclass. Understanding the concept is valuable; reaching for it in everyday work usually is not.

## Everything Is an Instance of Something

```python
x = 5
type(x)         # <class 'int'>, x is an instance of int

class Dog:
    pass

type(Dog)          # <class 'type'>, Dog itself is an instance of type!
type(type)            # <class 'type'>, type is its own metaclass
```

`type` is the default metaclass for every class in Python. When you write `class Dog: ...`, Python calls `type("Dog", bases, namespace)` behind the scenes to construct the class object.

## Creating a Class Dynamically with `type()`

```python
def bark(self):
    return "Woof"

Dog = type("Dog", (), {"bark": bark, "species": "Canine"})
# equivalent to:
# class Dog:
#     species = "Canine"
#     def bark(self):
#         return "Woof"

d = Dog()
d.bark()     # 'Woof'
```

## Writing a Custom Metaclass

```python
class UpperAttrMeta(type):
    def __new__(mcs, name, bases, namespace):
        uppercase_namespace = {
            key.upper() if not key.startswith("__") else key: value
            for key, value in namespace.items()
        }
        return super().__new__(mcs, name, bases, uppercase_namespace)

class Config(metaclass=UpperAttrMeta):
    timeout = 30
    retries = 3

Config.TIMEOUT       # 30, 'timeout' was uppercased at class CREATION time
```

## Real-World Uses of Metaclasses

```python
class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class DatabaseConnection(metaclass=SingletonMeta):
    def __init__(self):
        print("Creating new connection")

a = DatabaseConnection()     # prints 'Creating new connection'
b = DatabaseConnection()       # prints nothing, returns the SAME instance as a
a is b                            # True
```

> [!info] This is how many frameworks work internally
> Django's ORM (`models.Model`), various ABCs, and validation libraries all use metaclasses to auto-register fields, validate class definitions at creation time, or inject behavior, without requiring the class author to know any of it is happening.

## Metaclasses vs Class Decorators vs `__init_subclass__`

For simpler needs, lighter-weight alternatives exist and are usually preferred:

```python
# __init_subclass__: runs whenever a SUBCLASS is created, no metaclass needed
class Plugin:
    registry = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registry.append(cls)

class MyPlugin(Plugin):
    pass

Plugin.registry     # [<class '__main__.MyPlugin'>], auto-registered
```

> [!tip] Prefer `__init_subclass__` or class decorators over a metaclass when possible
> `__init_subclass__` (Python 3.6+) covers a large fraction of what people historically needed metaclasses for (auto-registration, validating subclass structure) with far less complexity, and it composes better with multiple inheritance. Reach for a full metaclass only when you need to control the class creation process itself, not just react to it.
