---
tags: [python, fundamentals, numbers]
aliases: [Python Numbers, int, float]
---

# Numbers

## Integers

Python integers have arbitrary precision, they do not overflow like fixed-width integers in C or Java.

```python
big = 2 ** 200          # works fine, no overflow
x = 1_000_000            # underscores as visual separators, evaluates to 1000000
```

## Floats

Floats follow IEEE 754 double precision, which means some decimal values cannot be represented exactly.

```python
0.1 + 0.2               # 0.30000000000000004, NOT exactly 0.3
0.1 + 0.2 == 0.3         # False!
```

> [!warning] Never compare floats with `==`
> Use `math.isclose()` instead:
> ```python
> import math
> math.isclose(0.1 + 0.2, 0.3)   # True
> ```

## Useful Numeric Functions

```python
abs(-5)          # 5
round(3.567, 2)   # 3.57
round(2.5)        # 2, banker's rounding! rounds to nearest even number
min(3, 7, 1)      # 1
max(3, 7, 1)      # 7
sum([1, 2, 3])    # 6
pow(2, 10)        # 1024, same as 2 ** 10
pow(2, 10, 100)   # 24, modular exponentiation (2**10) % 100, very fast for large numbers
divmod(7, 3)      # (2, 1), quotient and remainder together
```

> [!warning] Banker's rounding
> `round()` uses round-half-to-even, so `round(0.5)` is `0`, and `round(1.5)` is `2`. This surprises people used to "always round .5 up."

## The `math` Module

```python
import math

math.sqrt(16)        # 4.0
math.floor(4.7)       # 4
math.ceil(4.2)         # 5
math.pi                # 3.14159...
math.e                  # 2.71828...
math.log(100, 10)       # 2.0, log base 10
math.log2(8)             # 3.0
math.factorial(5)        # 120
math.gcd(12, 18)          # 6
math.inf                  # positive infinity, useful as an initial "minimum" sentinel
math.nan                   # "not a number", math.isnan(x) checks for it
```

## Type Conversion Between Numbers

```python
int(3.9)          # 3, truncates toward zero, does NOT round
int("42")          # 42
float(5)            # 5.0
float("3.14")        # 3.14
str(42)               # '42'
complex(2, 3)          # (2+3j)
```

## Number Bases

```python
bin(10)      # '0b1010'
oct(10)      # '0o12'
hex(255)     # '0xff'
int("1010", 2)   # 10, parse binary string
int("ff", 16)     # 255, parse hex string
```

## The `decimal` Module (For Exact Precision)

When exact decimal precision matters (money, financial calculations), floats are unsafe. Use `Decimal`.

```python
from decimal import Decimal

Decimal("0.1") + Decimal("0.2")   # Decimal('0.3'), exact
```

> [!tip] Money math
> Always use `Decimal` for currency calculations, never `float`. This applies directly to salary/CAGR or savings math where rounding errors compound over many rows.

## The `fractions` Module

```python
from fractions import Fraction

Fraction(1, 3) + Fraction(1, 6)   # Fraction(1, 2)
```
