---
tags: [python, functions, args, kwargs]
aliases: [args kwargs, *args, **kwargs, variadic functions]
---

# Args and Kwargs

`*args` and `**kwargs` let a function accept an arbitrary number of positional and keyword arguments.

## `*args`: Variable Positional Arguments

```python
def total(*args):
    print(args)      # args is a TUPLE of all positional arguments passed
    return sum(args)

total(1, 2, 3)         # (1, 2, 3) -> 6
total()                  # () -> 0
```

## `**kwargs`: Variable Keyword Arguments

```python
def describe(**kwargs):
    print(kwargs)      # kwargs is a DICT of all keyword arguments passed
    for key, value in kwargs.items():
        print(f"{key}: {value}")

describe(name="Bob", age=25)
# {'name': 'Bob', 'age': 25}
```

## Combining Regular, `*args`, and `**kwargs`

Order matters: regular positional params, then `*args`, then keyword-only params, then `**kwargs`.

```python
def func(a, b, *args, c=10, **kwargs):
    print(a, b, args, c, kwargs)

func(1, 2, 3, 4, c=5, d=6, e=7)
# a=1, b=2, args=(3, 4), c=5, kwargs={'d': 6, 'e': 7}
```

## Unpacking Into Function Calls (The Reverse Direction)

The `*` and `**` also work at the CALL site to unpack existing collections into arguments.

```python
def add(a, b, c):
    return a + b + c

nums = [1, 2, 3]
add(*nums)          # unpacks list into 3 positional args -> 6

params = {"a": 1, "b": 2, "c": 3}
add(**params)         # unpacks dict into keyword args -> 6
```

> [!tip] `*` and `**` at definition vs call site
> At function DEFINITION, `*args`/`**kwargs` COLLECT arguments into a tuple/dict.
> At function CALL, `*iterable`/`**dict` SPREAD an existing collection into individual arguments.
> The symbols are the same but the direction is opposite, this is the single most common point of confusion.

## Practical Use: Wrapper/Passthrough Functions

`*args, **kwargs` is essential for writing decorators or wrapper functions that need to forward arbitrary arguments to another function without knowing its exact signature.

```python
def logged(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

See [[Decorators]] for the full pattern this enables.

## Merging Dicts and Lists with Unpacking

```python
defaults = {"color": "blue", "size": "M"}
overrides = {"size": "L"}
merged = {**defaults, **overrides}     # {'color': 'blue', 'size': 'L'}

a = [1, 2]
b = [3, 4]
combined = [*a, *b]                     # [1, 2, 3, 4]
```
