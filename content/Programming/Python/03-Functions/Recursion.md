---
tags: [python, functions, recursion]
aliases: [Python Recursion]
---

# Recursion

A recursive function calls itself, working toward a base case that stops the recursion.

## Anatomy of a Recursive Function

Every correct recursive function needs:
1. A **base case** that returns directly without recursing.
2. A **recursive case** that calls itself with input that moves closer to the base case.

```python
def factorial(n):
    if n <= 1:            # base case
        return 1
    return n * factorial(n - 1)    # recursive case

factorial(5)      # 5 * 4 * 3 * 2 * 1 = 120
```

## Tracing Execution

```python
def factorial(n, depth=0):
    print("  " * depth + f"factorial({n})")
    if n <= 1:
        return 1
    result = n * factorial(n - 1, depth + 1)
    print("  " * depth + f"-> returns {result}")
    return result

factorial(4)
```

Each recursive call adds a new frame onto the call stack; the calls unwind (return) in reverse order once the base case is hit.

## Classic Examples

```python
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

def sum_list(lst):
    if not lst:
        return 0
    return lst[0] + sum_list(lst[1:])

def reverse_string(s):
    if len(s) <= 1:
        return s
    return reverse_string(s[1:]) + s[0]

def count_files(directory):        # simplified idea of recursive tree traversal
    total = 0
    for item in directory:
        if isinstance(item, list):    # subdirectory
            total += count_files(item)
        else:
            total += 1
    return total
```

## Recursion Limit

Python's default recursion depth limit is 1000 (a safety net against infinite recursion crashing the interpreter with a stack overflow).

```python
import sys
sys.getrecursionlimit()      # 1000 by default
sys.setrecursionlimit(3000)    # can be raised, but this is rarely the right fix
```

> [!warning] `RecursionError`
> Hitting the recursion limit raises `RecursionError: maximum recursion depth exceeded`. If you are hitting this, it usually means either the base case is wrong (infinite recursion) or the problem is better solved iteratively.

## Naive Recursion Can Be Extremely Slow

```python
fibonacci(35)     # naive recursive version, very slow, exponential time complexity O(2^n)
```

Fix with memoization (see [[Decorators]] `lru_cache`):

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

fibonacci(35)     # fast now, linear time due to caching
```

## Recursion vs Iteration

> [!tip] When to reach for recursion
> Recursion shines for naturally hierarchical/tree-like problems (file system traversal, JSON parsing, tree data structures) where the recursive structure of the SOLUTION mirrors the recursive structure of the DATA. For simple linear repetition (summing a list, counting), an iterative loop is usually faster and avoids stack depth limits, since Python does not optimize tail calls the way some other languages do.

## Mutual Recursion

Two functions calling each other.

```python
def is_even(n):
    if n == 0:
        return True
    return is_odd(n - 1)

def is_odd(n):
    if n == 0:
        return False
    return is_even(n - 1)

is_even(10)     # True
```
