---
tags: [python, generators, yield]
aliases: [Python Generators, yield, Generator Functions]
---

# Generators

A generator function automatically implements the iterator protocol using `yield` instead of `return`, without any of the boilerplate seen in [[Iterators]].

## Basic Generator Function

```python
def count_up(start, end):
    current = start
    while current <= end:
        yield current      # pauses here, remembers state, resumes on next call
        current += 1

for n in count_up(1, 5):
    print(n)     # 1 2 3 4 5
```

Calling a generator function does not run its body immediately, it returns a generator OBJECT.

```python
gen = count_up(1, 3)
gen              # <generator object count_up at 0x...>
next(gen)          # 1, execution runs until the first yield
next(gen)            # 2
next(gen)              # 3
next(gen)                # StopIteration
```

## How `yield` Pauses and Resumes

Each call to `next()` resumes execution right after the last `yield`, running until the next `yield` or the function ends.

```python
def demo():
    print("start")
    yield 1
    print("middle")
    yield 2
    print("end")

g = demo()
next(g)     # prints 'start', returns 1
next(g)       # prints 'middle', returns 2
next(g)         # prints 'end', then raises StopIteration
```

## Why Use Generators: Lazy Evaluation and Memory Efficiency

```python
def all_numbers():             # generates values forever, no memory blowup
    n = 0
    while True:
        yield n
        n += 1

def first_n(iterable, n):
    it = iter(iterable)
    return [next(it) for _ in range(n)]

first_n(all_numbers(), 5)     # [0, 1, 2, 3, 4], only 5 values ever computed
```

```python
# Reading a huge file line by line without loading it all into memory
def read_large_file(path):
    with open(path) as f:
        for line in f:
            yield line.strip()

for line in read_large_file("huge_log.txt"):
    process(line)      # each line generated on demand, file never fully loaded
```

> [!tip] Generators vs Lists
> Use a generator when you will consume values once, in order, and do not need random access, `len()`, or to re-iterate. Use a list when you need to index into it, check its length, iterate multiple times, or pass it to something that requires a concrete sequence.

## Generator Expressions (Recap)

```python
squares_gen = (x**2 for x in range(10))    # see [[Comprehensions]]
sum(x**2 for x in range(1000))               # memory efficient sum, no intermediate list
```

## `yield from`: Delegating to a Sub-Generator

```python
def inner():
    yield 1
    yield 2

def outer():
    yield "start"
    yield from inner()     # delegates, yielding 1 then 2 as if outer yielded them directly
    yield "end"

list(outer())     # ['start', 1, 2, 'end']
```

```python
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)     # recursive generator delegation
        else:
            yield item

list(flatten([1, [2, 3, [4, 5]], 6]))     # [1, 2, 3, 4, 5, 6]
```

## Sending Values Into a Generator

`yield` can also be an expression that receives a value via `.send()`, enabling two-way communication (advanced, rarely needed in everyday code).

```python
def echo():
    while True:
        received = yield
        print(f"Got: {received}")

gen = echo()
next(gen)          # prime the generator, advances to the first yield
gen.send("hi")        # prints 'Got: hi'
gen.send("bye")         # prints 'Got: bye'
```

## Generators and Exceptions

```python
def gen():
    try:
        yield 1
        yield 2
    finally:
        print("Cleanup ran")

g = gen()
next(g)
g.close()     # prints 'Cleanup ran', stops the generator early
```

## Infinite Generators with `itertools`

```python
import itertools

counter = itertools.count(start=1, step=2)    # 1, 3, 5, 7, ... forever
cycler = itertools.cycle(["A", "B", "C"])        # A, B, C, A, B, C, ... forever
```

See [[Itertools-and-Functools]] for the full toolkit built around this pattern.
