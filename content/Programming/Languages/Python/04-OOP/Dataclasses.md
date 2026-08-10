---
tags: [python, oop, dataclasses]
aliases: [Python Dataclasses, "@dataclass"]
---

# Dataclasses

`@dataclass` (Python 3.7+) auto-generates boilerplate like `__init__`, `__repr__`, and `__eq__` for classes whose main job is holding data.

## The Problem Dataclasses Solve

```python
# Without dataclass: lots of repetitive boilerplate
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point(x={self.x}, y={self.y})"

    def __eq__(self, other):
        return isinstance(other, Point) and self.x == other.x and self.y == other.y
```

```python
# With dataclass: same result, far less code
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

p1 = Point(1, 2)
p2 = Point(1, 2)
print(p1)             # Point(x=1, y=2), __repr__ auto-generated
p1 == p2                # True, __eq__ auto-generated (compares field by field)
```

## Default Values

```python
from dataclasses import dataclass, field

@dataclass
class User:
    name: str
    age: int = 18                       # simple default
    tags: list = field(default_factory=list)   # mutable default, MUST use default_factory

u = User("Bob")
u.age      # 18
u.tags       # []
```

> [!warning] Never use a mutable literal as a dataclass default
> ```python
> @dataclass
> class User:
>     tags: list = []      # ValueError! dataclass explicitly forbids this
> ```
> This is the dataclass equivalent of the mutable default argument trap (see [[Common-Pitfalls]]). Use `field(default_factory=list)` instead, which creates a fresh list per instance.

## `frozen=True`: Immutable Dataclasses

```python
@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
p.x = 99      # FrozenInstanceError, cannot modify after creation
```

Frozen dataclasses with only hashable fields are automatically hashable, usable as dict keys or set members.

## Ordering

```python
@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

Version(1, 2, 0) < Version(1, 3, 0)     # True, compares field by field in declaration order
```

## Post-Init Processing

```python
@dataclass
class Rectangle:
    width: float
    height: float
    area: float = field(init=False)      # excluded from __init__ parameters

    def __post_init__(self):
        self.area = self.width * self.height     # computed after __init__ runs

r = Rectangle(4, 5)
r.area      # 20
```

## Inheritance with Dataclasses

```python
@dataclass
class Animal:
    name: str
    sound: str = "..."

@dataclass
class Dog(Animal):
    breed: str = "Unknown"

d = Dog(name="Rex", sound="Woof", breed="Labrador")
```

> [!warning] Field ordering rule with inheritance
> All fields with defaults must come AFTER fields without defaults, across the ENTIRE inheritance chain combined. This can force you to give every field in a subclass a default if the parent has any defaulted field.

## Converting To/From Dicts

```python
from dataclasses import asdict, astuple

p = Point(1, 2)
asdict(p)         # {'x': 1, 'y': 2}
astuple(p)          # (1, 2)
```

## `dataclass` vs `namedtuple` vs Plain Class

| Feature | `dataclass` | `namedtuple` | Plain class |
|---|---|---|---|
| Mutable | Yes (unless `frozen=True`) | No | Yes |
| Auto `__init__`/`__repr__`/`__eq__` | Yes | Yes | No, manual |
| Type hints | Encouraged | Optional | Optional |
| Methods allowed | Yes, full class | Yes, limited | Yes, full class |
| Inheritance | Yes | Awkward | Yes |

> [!tip] Default choice for simple data containers
> Reach for `@dataclass` any time you catch yourself writing a class that is mostly `__init__` assigning parameters to `self`. It removes the boilerplate while keeping full class capabilities (methods, inheritance, etc).
