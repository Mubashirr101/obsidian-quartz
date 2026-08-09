---
tags: [python, fundamentals, control-flow]
aliases: [Python Control Flow, if else, loops]
---

# Control Flow

## if / elif / else

```python
age = 20

if age < 13:
    category = "child"
elif age < 20:
    category = "teen"
else:
    category = "adult"
```

### Conditional (Ternary) Expression

```python
status = "adult" if age >= 18 else "minor"
```

## `while` Loops

```python
count = 0
while count < 5:
    print(count)
    count += 1
```

### `while` with `else`

The `else` block runs only if the loop completes without hitting a `break`.

```python
n = 7
i = 2
while i < n:
    if n % i == 0:
        print(f"{n} is not prime")
        break
    i += 1
else:
    print(f"{n} is prime")
```

## `for` Loops

Python's `for` iterates over any iterable, it is not a C-style counting loop.

```python
for fruit in ["apple", "banana", "cherry"]:
    print(fruit)

for i in range(5):          # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2):   # start, stop, step -> 2, 4, 6, 8
    print(i)

for index, value in enumerate(["a", "b", "c"]):
    print(index, value)      # 0 a / 1 b / 2 c

for key, value in {"x": 1, "y": 2}.items():
    print(key, value)
```

> [!tip] `enumerate` over manual counters
> Never write `i = 0` then `i += 1` inside a loop to track index. Use `enumerate(iterable, start=0)` instead, it is cleaner and less error prone.

## `break`, `continue`, `pass`

```python
for i in range(10):
    if i == 5:
        break          # exits the loop entirely
    if i % 2 == 0:
        continue        # skips to next iteration
    print(i)

if True:
    pass                # does nothing, a placeholder for future code
```

## `match` / `case` (Structural Pattern Matching, Python 3.10+)

A more powerful alternative to long `if/elif` chains, supporting pattern destructuring.

```python
def handle(command):
    match command.split():
        case ["go", direction]:
            print(f"Moving {direction}")
        case ["look"]:
            print("Looking around")
        case ["take", *items]:
            print(f"Taking {items}")
        case _:
            print("Unknown command")

handle("go north")     # Moving north
handle("take sword shield")  # Taking ['sword', 'shield']
```

```python
def describe(value):
    match value:
        case 0:
            return "zero"
        case int() | float() if value < 0:
            return "negative number"
        case [x, y]:
            return f"a pair: {x}, {y}"
        case {"type": "user", "name": name}:
            return f"user named {name}"
        case _:
            return "something else"
```

> [!info] `_` is the wildcard
> `case _:` matches anything, similar to `default` in other languages. It should almost always be the last case.

## Nested Loops and Labeled-Break Alternative

Python has no labeled break/continue. The common workaround is a flag or refactoring into a function with `return`.

```python
found = False
for i in range(5):
    for j in range(5):
        if i * j == 6:
            found = True
            break
    if found:
        break
```

A cleaner approach: extract the nested loops into a function and use `return` to exit both levels at once.

## `for...else` and `while...else`

Just like `while`, `for` supports `else`, which runs if the loop was not exited via `break`. This is a genuinely underused but powerful pattern for "search and act if not found" logic.

```python
for item in inventory:
    if item.name == "key":
        print("Found the key")
        break
else:
    print("Key not found anywhere")
```
