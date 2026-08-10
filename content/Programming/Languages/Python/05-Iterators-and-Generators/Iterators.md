---
tags: [python, iterators, iteration-protocol]
aliases: [Python Iterators, Iterable, Iterator Protocol]
---

# Iterators

## Iterable vs Iterator: The Key Distinction

- An **iterable** is anything you can loop over (`list`, `dict`, `str`, `set`...). It implements `__iter__()`.
- An **iterator** is the object that actually produces values one at a time, tracking position. It implements both `__iter__()` and `__next__()`.

```python
nums = [1, 2, 3]        # nums is an ITERABLE
it = iter(nums)            # calling iter() on it produces an ITERATOR
next(it)                      # 1
next(it)                        # 2
next(it)                          # 3
next(it)                            # StopIteration! no more items
```

> [!info] What a `for` loop does internally
> ```python
> for x in nums:
>     print(x)
> ```
> is roughly equivalent to:
> ```python
> it = iter(nums)
> while True:
>     try:
>         x = next(it)
>     except StopIteration:
>         break
>     print(x)
> ```

## Building a Custom Iterator

Implement `__iter__` (returns self) and `__next__` (returns next value, raises `StopIteration` when done).

```python
class CountUp:
    def __init__(self, start, end):
        self.current = start
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.end:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

for n in CountUp(1, 5):
    print(n)     # 1 2 3 4 5
```

## Separating Iterable from Iterator (The Correct Pattern for Reusability)

The above `CountUp` example has a flaw: once exhausted, it cannot be iterated again (the state is stuck at `end + 1`). The standard fix is to separate the container (iterable) from the iterator it produces.

```python
class NumberRange:                    # ITERABLE: knows the data, produces fresh iterators
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def __iter__(self):
        return NumberRangeIterator(self.start, self.end)

class NumberRangeIterator:              # ITERATOR: tracks position for ONE pass
    def __init__(self, current, end):
        self.current = current
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current > self.end:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

r = NumberRange(1, 3)
list(r)     # [1, 2, 3]
list(r)       # [1, 2, 3] again! each `iter(r)` call creates a fresh iterator
```

## Manually Draining an Iterator

```python
it = iter([1, 2, 3])
next(it, "default")    # 1, second argument avoids StopIteration if exhausted
next(it, "default")      # 2
next(it, "default")        # 3
next(it, "default")          # 'default', instead of raising
```

## Built-in Functions That Work on Any Iterable

```python
list(range(5))
sum(x for x in range(5))
max([3, 1, 4])
sorted("dcba")
any(x > 2 for x in [1, 2, 3])
all(x > 0 for x in [1, 2, 3])
```

See [[Generators]] for the far more common, easier way to build custom iterators using `yield`.
