---
tags: [python, functions, lambda]
aliases: [Lambda Functions, Anonymous Functions]
---

# Lambda Functions

A `lambda` is a small anonymous function limited to a single expression. It implicitly returns the value of that expression, no `return` keyword needed.

## Syntax

```python
square = lambda x: x ** 2
square(5)     # 25

add = lambda a, b: a + b
add(3, 4)      # 7

greet = lambda name="World": f"Hello, {name}"
greet()          # 'Hello, World'
```

Equivalent regular function for comparison:

```python
def square(x):
    return x ** 2
```

## Where Lambdas Actually Shine: As Arguments to Other Functions

```python
words = ["banana", "kiwi", "apple", "fig"]
words.sort(key=lambda w: len(w))       # sort by length

nums = [1, -2, 3, -4, 5]
sorted(nums, key=lambda x: abs(x))       # sort by absolute value

people = [{"name": "Bob", "age": 30}, {"name": "Amy", "age": 25}]
sorted(people, key=lambda p: p["age"])

list(filter(lambda x: x % 2 == 0, range(10)))     # [0, 2, 4, 6, 8]
list(map(lambda x: x * 2, [1, 2, 3]))               # [2, 4, 6]
```

## `map()`, `filter()`, `reduce()`

```python
from functools import reduce

nums = [1, 2, 3, 4]

list(map(lambda x: x**2, nums))                # [1, 4, 9, 16]
list(filter(lambda x: x % 2 == 0, nums))          # [2, 4]
reduce(lambda acc, x: acc + x, nums)                # 10, cumulative reduction
reduce(lambda acc, x: acc + x, nums, 100)             # 110, with an initial value
```

> [!tip] Comprehensions are often more Pythonic than `map`/`filter`
> `[x**2 for x in nums]` is generally preferred over `list(map(lambda x: x**2, nums))` for readability. `map`/`filter` shine mainly when passing an EXISTING named function without wrapping it in a lambda: `map(str, nums)`.

## When NOT to Use Lambda

> [!warning] Do not assign lambdas to a name
> ```python
> square = lambda x: x ** 2   # PEP 8 discourages this
> ```
> If it needs a name, it deserves a proper `def`:
> ```python
> def square(x):
>     return x ** 2
> ```
> Named `def` functions get better tracebacks (the function name shows up in error messages instead of `<lambda>`), support docstrings, and support multiple statements.

## Limitations

- Only a single expression, no statements (no `if` blocks with bodies, no loops, no assignments via `=`).
- Can use a conditional EXPRESSION though:

```python
classify = lambda x: "even" if x % 2 == 0 else "odd"
classify(4)     # 'even'
```

- No type annotations directly on lambda parameters (unlike regular `def` functions).
