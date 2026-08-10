---
tags: [python, fundamentals, data-types]
aliases: [Python Variables, Python Data Types]
---

# Variables and Data Types

## Variable Assignment

Python is dynamically typed: a variable's type is determined at runtime and can change.

```python
x = 10          # x is an int
x = "hello"     # now x is a str, perfectly legal
```

Variables are names bound to objects, not boxes holding values. This distinction matters for mutability, see the note on mutable default arguments in [[Common-Pitfalls]].

```python
a = [1, 2, 3]
b = a          # b points to the SAME list object as a
b.append(4)
print(a)       # [1, 2, 3, 4]  now a changed too
```

## Multiple Assignment

```python
x, y, z = 1, 2, 3
a = b = c = 0            # all three point to the same int object (ints are immutable so this is safe)
x, y = y, x               # classic swap, no temp variable needed
first, *rest = [1, 2, 3, 4]   # first = 1, rest = [2, 3, 4]
```

## Core Built-in Types

| Type | Example | Mutable? | Notes |
|---|---|---|---|
| `int` | `42` | No | Arbitrary precision, no overflow |
| `float` | `3.14` | No | Double precision (64-bit) |
| `complex` | `2 + 3j` | No | Rarely used outside scientific code |
| `bool` | `True`, `False` | No | Subclass of `int` (`True == 1`) |
| `str` | `"hi"` | No | Sequence of Unicode characters |
| `list` | `[1, 2]` | Yes | Ordered, allows duplicates |
| `tuple` | `(1, 2)` | No | Ordered, immutable |
| `dict` | `{"a": 1}` | Yes | Key value mapping, insertion ordered since 3.7 |
| `set` | `{1, 2}` | Yes | Unordered, unique elements |
| `frozenset` | `frozenset({1,2})` | No | Immutable set |
| `NoneType` | `None` | N/A | Represents absence of a value |

## Checking Types

```python
x = 42
type(x)                  # <class 'int'>
isinstance(x, int)       # True, preferred over type() == comparisons
isinstance(x, (int, float))  # True if either type matches
```

> [!tip] `isinstance` over `type() ==`
> `isinstance()` respects inheritance, so it correctly handles subclasses. Direct `type(x) == int` comparisons break polymorphism.

## Dynamic Typing vs Duck Typing

Python does not care about an object's declared type, only what it can do (if it walks like a duck and quacks like a duck).

```python
def describe(item):
    print(item.upper())  # works for anything with an .upper() method

describe("hello")   # works, str has .upper()
```

## `None` and Truthiness

`None` is Python's null value, a singleton object of `NoneType`.

```python
x = None
x is None       # True, always use 'is' not '==' for None checks
```

> [!warning] `is` vs `==`
> `==` checks value equality, `is` checks object identity. Always use `is None` or `is not None`, never `== None`.

### Falsy Values

The following are all considered `False` in a boolean context:

```python
bool(None)      # False
bool(0)         # False
bool(0.0)       # False
bool("")        # False
bool([])        # False
bool({})        # False
bool(set())     # False
bool(())        # False
```

Everything else is truthy, including non-empty strings, non-zero numbers, and non-empty collections.

## Constants

Python has no true constants, only convention. Uppercase names signal "do not reassign this."

```python
MAX_RETRIES = 5
PI = 3.14159
```

For enforced immutability, use `typing.Final` (see [[Type-Hints-and-Typing]]) or an `Enum` (see [[Standard-Library-Highlights]]).
