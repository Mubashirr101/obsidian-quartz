---
tags: [python, fundamentals, type-conversion]
aliases: [Type Casting, Type Conversion]
---

# Type Conversion

## Implicit Conversion (Coercion)

Python automatically converts compatible types in mixed expressions.

```python
3 + 4.5        # 7.5, int is upgraded to float
True + 1       # 2, bool is treated as int (True=1, False=0)
```

## Explicit Conversion

```python
int("42")          # 42
int("42.5")          # ValueError! int() cannot parse a decimal string directly
int(float("42.5"))    # 42, convert to float first, then truncate

float("3.14")          # 3.14
str(3.14)                # '3.14'
bool(0)                    # False
bool(1)                     # True
bool("")                     # False
bool("False")                  # True! any non-empty string is truthy, even the string "False"
list("abc")                     # ['a', 'b', 'c']
tuple([1, 2, 3])                  # (1, 2, 3)
set([1, 2, 2, 3])                   # {1, 2, 3}
dict([("a", 1), ("b", 2)])           # {'a': 1, 'b': 2}
```

> [!warning] `bool("False")` is `True`
> This trips up a lot of people reading config values or CLI arguments. A string is truthy as long as it is non-empty, regardless of its content. To parse a "true/false" string properly, compare it explicitly: `value.lower() == "true"`.

## Safe Conversion with Error Handling

```python
def safe_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

safe_int("abc")     # 0
safe_int("42")       # 42
safe_int(None)         # 0
```

## Checking Before Converting

```python
s = "123"
if s.isdigit():
    n = int(s)
```

> [!tip]
> `str.isdigit()` only works for non-negative integer strings. For floats or negative numbers, wrap the conversion in a `try/except` block instead, it is more robust than pre-validating with string checks.
