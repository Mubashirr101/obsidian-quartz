---
tags: [python, data-structures, comprehensions]
aliases: [List Comprehension, Dict Comprehension, Set Comprehension, Generator Expression]
---

# Comprehensions

Comprehensions are a concise, Pythonic way to build lists, dicts, sets, and generators from an iterable in a single expression.

## List Comprehension

```python
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]

# equivalent to:
evens = []
for x in range(20):
    if x % 2 == 0:
        evens.append(x)
```

### With `if/else` (Conditional Expression, Different From Filtering)

```python
labels = ["even" if x % 2 == 0 else "odd" for x in range(5)]
# ['even', 'odd', 'even', 'odd', 'even']
```

> [!warning] Filter vs conditional expression syntax differs
> `[x for x in items if condition]` FILTERS which items are included.
> `[a if condition else b for x in items]` transforms EVERY item, choosing between two values. Mixing these up is a common source of confusion; the position of `if` (before or after `for`) is the tell.

### Nested Loops in a Comprehension

```python
pairs = [(x, y) for x in range(3) for y in range(3)]
# [(0,0),(0,1),(0,2),(1,0),(1,1),(1,2),(2,0),(2,1),(2,2)]

# Flattening a 2D list
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]
# order matches nested for loops written normally: outer loop first, then inner
```

### Nested Comprehension (Comprehension Inside Comprehension)

```python
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[i] for row in matrix] for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]
```

## Dictionary Comprehension

```python
d = {x: x**2 for x in range(5)}
squared_lengths = {word: len(word) for word in ["hi", "hello", "hey"]}
filtered = {k: v for k, v in d.items() if v > 5}
```

## Set Comprehension

```python
unique_lengths = {len(word) for word in ["hi", "bye", "hey", "no"]}
```

## Generator Expression

Looks like a list comprehension but uses `()` instead of `[]`. It produces values lazily, one at a time, instead of building the entire collection in memory.

```python
gen = (x**2 for x in range(1_000_000))    # instant, no memory allocated yet
next(gen)      # 0
next(gen)      # 1

total = sum(x**2 for x in range(1000))    # parentheses can be omitted when it's the sole function argument
```

> [!tip] When to use a generator expression instead of a list comprehension
> Use `()` instead of `[]` whenever you are going to consume the values only once, especially for large or unbounded sequences. It saves memory since values are computed on demand rather than stored all at once. See [[Generators]] for the deeper mechanics.

## Readability Guideline

> [!warning] Do not over-nest comprehensions
> A comprehension with more than 2 levels of nesting or multiple conditions becomes harder to read than an equivalent explicit `for` loop. If you have to squint to parse it, write it as a regular loop instead. Comprehensions should read almost like an English sentence: "give me x squared, for each x in range, if x is even."

## Performance Note

Comprehensions are generally faster than equivalent `for` loops with `.append()` calls, because the looping happens in optimized C code internally rather than through repeated Python-level method lookups.

```python
# Faster
squares = [x**2 for x in range(100000)]

# Slower (more Python-level overhead per iteration)
squares = []
for x in range(100000):
    squares.append(x**2)
```
