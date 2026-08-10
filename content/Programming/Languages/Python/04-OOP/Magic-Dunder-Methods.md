---
tags: [python, oop, dunder-methods, magic-methods]
aliases: [Dunder Methods, Magic Methods, "__init__", Operator Overloading]
---

# Magic (Dunder) Methods

Dunder methods (double underscore, e.g. `__init__`) let custom classes hook into Python's built-in syntax and functions: printing, comparisons, arithmetic, iteration, and more.

## Object Representation

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        # unambiguous, developer-facing, ideally something that could recreate the object
        return f"Point({self.x!r}, {self.y!r})"

    def __str__(self):
        # readable, user-facing, used by print() and str()
        return f"({self.x}, {self.y})"

p = Point(1, 2)
print(p)          # uses __str__ -> (1, 2)
repr(p)             # uses __repr__ -> 'Point(1, 2)'
[p]                   # in a container/repl, falls back to __repr__ -> [Point(1, 2)]
```

> [!tip] If you only define one, define `__repr__`
> `__str__` falls back to `__repr__` automatically if not defined. The reverse is not true. `__repr__` should be unambiguous, ideally valid Python that could recreate the object.

## Equality and Hashing

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __hash__(self):
        return hash((self.x, self.y))

Point(1, 2) == Point(1, 2)     # True, without __eq__ this would be False (identity check)
```

> [!warning] Defining `__eq__` disables the default `__hash__`
> If you override `__eq__`, Python sets `__hash__` to `None` automatically, making instances unhashable (cannot be dict keys or set members) unless you also explicitly define `__hash__`.

## Comparison Operators

```python
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __lt__(self, other): return self.amount < other.amount
    def __le__(self, other): return self.amount <= other.amount
    def __gt__(self, other): return self.amount > other.amount
    def __ge__(self, other): return self.amount >= other.amount
```

> [!tip] `functools.total_ordering`
> Define just `__eq__` and one of `__lt__`/`__le__`/`__gt__`/`__ge__`, then decorate the class with `@functools.total_ordering` to auto-generate the rest.

## Arithmetic Operator Overloading

```python
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

Vector(1, 2) + Vector(3, 4)     # Vector(4, 6)
Vector(1, 2) * 3                  # Vector(3, 6)
```

## Container/Sequence Protocol

Implementing these lets your objects behave like built-in lists/dicts.

```python
class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)

    def __getitem__(self, index):
        return self.songs[index]

    def __setitem__(self, index, value):
        self.songs[index] = value

    def __contains__(self, item):
        return item in self.songs

    def __iter__(self):
        return iter(self.songs)

p = Playlist(["A", "B", "C"])
len(p)             # 3
p[0]                 # 'A'
"B" in p               # True
for song in p: ...       # iteration works automatically
```

## Callable Objects

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
double(5)     # 10, the instance itself can be "called" like a function
```

## Context Manager Protocol

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        import time
        print(f"Elapsed: {time.perf_counter() - self.start:.4f}s")

with Timer():
    sum(range(1_000_000))
```

See [[Context-Managers]] for the full protocol.

## Quick Reference Table

| Dunder | Triggered by | Purpose |
|---|---|---|
| `__init__` | `ClassName(...)` | Initialize a new instance |
| `__new__` | `ClassName(...)` (before `__init__`) | Actually create the instance |
| `__repr__` | `repr(obj)`, console display | Unambiguous developer representation |
| `__str__` | `str(obj)`, `print(obj)` | Readable user-facing representation |
| `__eq__` | `==` | Value equality |
| `__lt__`/`__le__`/`__gt__`/`__ge__` | `<`, `<=`, `>`, `>=` | Ordering |
| `__hash__` | `hash(obj)`, dict/set keys | Hashability |
| `__len__` | `len(obj)` | Length |
| `__getitem__` | `obj[key]` | Index/key access |
| `__setitem__` | `obj[key] = value` | Index/key assignment |
| `__contains__` | `x in obj` | Membership test |
| `__iter__` | `for x in obj` | Iteration |
| `__call__` | `obj(...)` | Making an instance callable |
| `__enter__`/`__exit__` | `with obj:` | Context manager protocol |
| `__add__`, `__sub__`, `__mul__`, etc | `+`, `-`, `*` | Arithmetic overloading |
| `__bool__` | `bool(obj)`, `if obj:` | Truthiness |
| `__del__` | garbage collection | Cleanup before destruction (rarely needed) |
