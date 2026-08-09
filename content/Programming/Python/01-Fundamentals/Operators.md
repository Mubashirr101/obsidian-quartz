---
tags: [python, fundamentals, operators]
aliases: [Python Operators]
---

# Operators

## Arithmetic Operators

```python
7 + 3     # 10   addition
7 - 3     # 4    subtraction
7 * 3     # 21   multiplication
7 / 3     # 2.333...  true division, ALWAYS returns float
7 // 3    # 2    floor division, rounds toward negative infinity
7 % 3     # 1    modulo, remainder of division
7 ** 3    # 343  exponentiation
```

> [!warning] Floor division with negatives
> `-7 // 2` gives `-4`, not `-3`. Floor division always rounds down (toward negative infinity), not toward zero.

## Comparison Operators

```python
5 == 5     # True, equality
5 != 4     # True, inequality
5 > 3      # True
5 < 3      # False
5 >= 5     # True
5 <= 4     # False
```

Comparisons can be chained:

```python
x = 5
1 < x < 10        # True, equivalent to (1 < x) and (x < 10)
```

## Logical Operators

```python
True and False    # False
True or False      # True
not True            # False
```

> [!tip] Short circuit evaluation
> `and` returns the first falsy value or the last value. `or` returns the first truthy value or the last value. This enables common idioms:
> ```python
> name = user_input or "default"   # fallback if user_input is empty/None
> ```

## Assignment Operators

```python
x = 5
x += 1   # x = x + 1  -> 6
x -= 1   # 5
x *= 2   # 10
x /= 2   # 5.0
x //= 2  # 2.0
x **= 2  # 4.0
x %= 3   # 1.0
```

## The Walrus Operator `:=` (Python 3.8+)

Assigns and returns a value in the same expression, useful inside conditionals or comprehensions.

```python
# Without walrus
data = get_data()
if data:
    process(data)

# With walrus
if (data := get_data()):
    process(data)

# Inside a comprehension, avoids calling a function twice
results = [y for x in values if (y := expensive(x)) > 0]
```

## Identity vs Equality: `is` vs `==`

```python
a = [1, 2, 3]
b = [1, 2, 3]
a == b     # True, same values
a is b     # False, different objects in memory
a is a     # True, same object
```

> [!tip]
> Small integers (-5 to 256) and short strings are cached by CPython, so `is` may accidentally return `True` for them. Never rely on this behavior, always use `==` for value comparison and `is` only for `None`/`True`/`False`/singleton checks.

## Membership Operators

```python
3 in [1, 2, 3]        # True
"a" in "abc"           # True
3 not in [1, 2, 3]     # False
```

## Bitwise Operators

```python
5 & 3    # 1   AND
5 | 3    # 7   OR
5 ^ 3    # 6   XOR
~5       # -6  NOT (inverts all bits)
5 << 1   # 10  left shift (multiply by 2)
5 >> 1   # 2   right shift (divide by 2, floor)
```

## Operator Precedence (high to low, abbreviated)

1. `()` parentheses
2. `**` exponentiation
3. `+x`, `-x`, `~x` unary
4. `*`, `/`, `//`, `%`
5. `+`, `-`
6. Comparisons, `in`, `is`
7. `not`
8. `and`
9. `or`

> [!tip] When in doubt, parenthesize
> Relying on memorized precedence rules makes code harder to review. Adding explicit parentheses costs nothing and removes ambiguity for the next reader (often future you).
