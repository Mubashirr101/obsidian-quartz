---
tags: [python, data-structures, tuples]
aliases: [Python Tuples, tuple]
---

# Tuples

Tuples are ordered and immutable. Once created, elements cannot be added, removed, or changed.

## Creating Tuples

```python
empty = ()
single = (5,)          # the trailing comma is REQUIRED, (5) is just an int in parens
t = (1, 2, 3)
t2 = 1, 2, 3             # parentheses optional when unambiguous
from_list = tuple([1, 2, 3])
```

> [!warning] The single element trap
> `(5)` evaluates to the integer `5`, not a tuple. You must write `(5,)` with the trailing comma to make a one element tuple.

## Indexing and Slicing

Identical syntax to lists.

```python
t = (10, 20, 30, 40)
t[0]        # 10
t[-1]        # 40
t[1:3]        # (20, 30)
```

## Immutability

```python
t = (1, 2, 3)
t[0] = 99      # TypeError: 'tuple' object does not support item assignment
```

> [!info] Immutability is shallow
> If a tuple contains a mutable object like a list, that inner object can still be mutated: `t = ([1, 2],); t[0].append(3)` works fine, only the tuple's own slots are locked.

## Tuple Unpacking

```python
point = (3, 4)
x, y = point            # x=3, y=4

a, b, *rest = (1, 2, 3, 4, 5)     # a=1, b=2, rest=[3, 4, 5]
*rest, last = (1, 2, 3, 4)           # rest=[1, 2, 3], last=4

for x, y in [(1, 2), (3, 4)]:
    print(x, y)
```

## Why Use a Tuple Instead of a List

- Signals intent: "this data should not change."
- Slightly faster and more memory efficient than lists.
- Hashable (if all elements are hashable), so tuples can be used as dictionary keys or set members, unlike lists.

```python
locations = {}
locations[(19.0760, 72.8777)] = "Mumbai"    # tuple as dict key, works
locations[[19.0760, 72.8777]] = "Mumbai"    # TypeError: list is unhashable
```

## `namedtuple` (Readable Alternative)

```python
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
p.x          # 3
p.y           # 4
p[0]           # 3, still supports index access
```

> [!tip] `namedtuple` vs `dataclass`
> `namedtuple` is lightweight and tuple-compatible (immutable, hashable, unpackable). For anything with methods, default values, or that needs to stay mutable, prefer `dataclass` (see [[Dataclasses]]).

## Common Uses

```python
# Returning multiple values from a function
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])

# Swapping variables (internally uses a tuple)
a, b = 1, 2
a, b = b, a
```

Tuples and lists cover most sequence needs. See [[Dictionaries]] and [[Sets]] for unordered collections.
