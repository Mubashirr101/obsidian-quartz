---
tags: [python, itertools, functools, standard-library]
aliases: [itertools, functools]
---

# Itertools and Functools

Two standard library modules built specifically around functional-style, iterator-based programming.

## `itertools`: Iterator Building Blocks

### Infinite Iterators

```python
import itertools

itertools.count(10, 2)          # 10, 12, 14, 16, ... forever
itertools.cycle([1, 2, 3])         # 1, 2, 3, 1, 2, 3, ... forever
itertools.repeat("x", 3)             # 'x', 'x', 'x'
```

### Combinatoric Generators

```python
list(itertools.permutations([1, 2, 3]))
# [(1,2,3),(1,3,2),(2,1,3),(2,3,1),(3,1,2),(3,2,1)]

list(itertools.permutations([1, 2, 3], 2))     # length-2 permutations
# [(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)]

list(itertools.combinations([1, 2, 3], 2))       # order doesn't matter, no repeats
# [(1,2),(1,3),(2,3)]

list(itertools.combinations_with_replacement([1, 2, 3], 2))
# [(1,1),(1,2),(1,3),(2,2),(2,3),(3,3)]

list(itertools.product([1, 2], ["a", "b"]))          # cartesian product
# [(1,'a'),(1,'b'),(2,'a'),(2,'b')]

list(itertools.product([0, 1], repeat=3))              # all 3-bit combinations
```

### Chaining and Grouping

```python
list(itertools.chain([1, 2], [3, 4], [5]))     # [1, 2, 3, 4, 5], flattens multiple iterables

data = [1, 1, 2, 2, 2, 3, 1]
for key, group in itertools.groupby(data):
    print(key, list(group))
# 1 [1, 1]
# 2 [2, 2, 2]
# 3 [3]
# 1 [1]
```

> [!warning] `groupby` only groups CONSECUTIVE equal elements
> Notice `1` appears in two separate groups above, because the data was not sorted first. Always `sort()` the input by the same key before using `groupby()` if you want ALL matching elements grouped together, not just runs of adjacent matches.

```python
list(itertools.islice(itertools.count(), 5))        # [0, 1, 2, 3, 4], slice an infinite iterator
list(itertools.zip_longest([1, 2, 3], ["a", "b"], fillvalue="?"))
# [(1,'a'), (2,'b'), (3,'?')]
```

## `functools`: Higher-Order Function Tools

### `reduce`

```python
from functools import reduce

reduce(lambda acc, x: acc + x, [1, 2, 3, 4])        # 10
reduce(lambda acc, x: acc * x, [1, 2, 3, 4], 1)       # 24, factorial-like with initial value
```

### `partial`: Pre-Filling Arguments

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)

square(5)     # 25
cube(5)         # 125
```

> [!tip] `partial` vs `lambda`
> `partial(power, exponent=2)` is more explicit and slightly more efficient than `lambda x: power(x, exponent=2)`, and it preserves better introspection (the underlying function is still accessible via `.func`).

### `lru_cache`: Memoization

Already covered in depth in [[Decorators]], the short version:

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive(n):
    ...
```

### `wraps`: Preserving Metadata in Decorators

```python
from functools import wraps

def decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### `cached_property`: Lazy, Cached Instance Attribute

```python
from functools import cached_property

class DataProcessor:
    def __init__(self, data):
        self.data = data

    @cached_property
    def summary(self):
        print("Computing summary...")
        return sum(self.data)

dp = DataProcessor([1, 2, 3])
dp.summary     # prints 'Computing summary...', returns 6
dp.summary       # returns 6 immediately, NOT recomputed, cached on the instance
```

### `total_ordering`

```python
from functools import total_ordering

@total_ordering
class Money:
    def __init__(self, amount):
        self.amount = amount

    def __eq__(self, other):
        return self.amount == other.amount

    def __lt__(self, other):
        return self.amount < other.amount

# total_ordering auto-fills in __le__, __gt__, __ge__ from the two methods above
```

### `singledispatch`: Function Overloading by Argument Type

```python
from functools import singledispatch

@singledispatch
def process(value):
    print(f"Generic: {value}")

@process.register
def _(value: int):
    print(f"Integer: {value}")

@process.register
def _(value: str):
    print(f"String: {value}")

process(42)         # Integer: 42
process("hi")          # String: hi
process(3.14)             # Generic: 3.14
```
