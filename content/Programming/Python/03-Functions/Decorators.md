---
tags: [python, functions, decorators]
aliases: [Python Decorators, "@decorator"]
---

# Decorators

A decorator is a function that takes another function, adds behavior around it, and returns a (usually wrapped) function. Decorators rely on functions being first-class objects and on closures.

## The Manual Version First (What `@` Actually Does)

```python
def shout(text):
    return text.upper()

def loud(func):
    def wrapper(text):
        return func(text) + "!!!"
    return wrapper

shout = loud(shout)     # manually re-assign shout to the wrapped version
shout("hi")                # 'HI!!!'
```

## The `@` Syntax (Syntactic Sugar for the Above)

```python
def loud(func):
    def wrapper(text):
        return func(text) + "!!!"
    return wrapper

@loud
def shout(text):
    return text.upper()

shout("hi")     # 'HI!!!'  -- identical result to the manual version
```

## Decorators That Work with Any Function Signature

Using `*args, **kwargs` (see [[Args-and-Kwargs]]) lets a decorator wrap functions regardless of their parameters.

```python
import functools
import time

def timer(func):
    @functools.wraps(func)         # preserves func.__name__, __doc__, etc
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_function(n):
    return sum(range(n))

slow_function(1_000_000)
```

> [!warning] Always use `@functools.wraps(func)`
> Without it, `wrapper.__name__` becomes `'wrapper'` instead of the original function's name, which breaks introspection, debugging, and documentation tools. This is easy to forget and hard to notice until something downstream (like `help()` or a framework's routing table) misbehaves.

## Decorators with Arguments

A decorator factory: a function that returns a decorator, allowing the decorator itself to be configured.

```python
def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet():
    print("Hello")

greet()     # prints 'Hello' 3 times
```

> [!info] Three levels deep
> `repeat(3)` -> returns `decorator` -> which wraps `greet` -> and returns `wrapper`. This three-layer nesting (factory -> decorator -> wrapper) is the standard shape for any parameterized decorator.

## Chaining Multiple Decorators

Decorators apply bottom-up (closest to the function first).

```python
@timer
@repeat(2)
def task():
    print("working")

# equivalent to: task = timer(repeat(2)(task))
```

## Common Built-in Decorators

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius

    @property
    def area(self):                    # access like an attribute: circle.area
        return 3.14159 * self._radius ** 2

    @staticmethod
    def unit_circle():                  # no self/cls, just a namespaced function
        return Circle(1)

    @classmethod
    def from_diameter(cls, diameter):     # receives the class, not an instance
        return cls(diameter / 2)
```

See [[Class-and-Static-Methods]] and [[Encapsulation-and-Properties]] for these in depth.

## `functools.lru_cache`: Memoization Decorator

Caches function results, dramatically speeding up expensive or recursive calls with repeated inputs.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci(35)     # fast, without caching this would take a very long time
```

> [!tip] `lru_cache` requires hashable arguments
> Functions decorated with `lru_cache` must be called with hashable arguments (numbers, strings, tuples), not lists or dicts, since the cache uses the arguments as dictionary keys internally.

## Class-Based Decorators

Any object with a `__call__` method can act as a decorator.

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0

    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"Call #{self.count} to {self.func.__name__}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hi():
    print("hi")

say_hi()     # Call #1 to say_hi / hi
say_hi()      # Call #2 to say_hi / hi
```

See [[Magic-Dunder-Methods]] for more on `__call__`.
