---
tags: [python, best-practices, pep8, style]
aliases: [PEP 8, Python Style Guide]
---

# PEP 8 and Style

PEP 8 is Python's official style guide. Following it makes code readable and consistent across the entire Python ecosystem.

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Variable, function | `snake_case` | `user_name`, `calculate_total()` |
| Class | `PascalCase` | `UserAccount`, `HTTPRequest` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_KEY` |
| Module | `lowercase` or `snake_case` | `utils.py`, `data_loader.py` |
| Private/internal (convention only) | leading underscore | `_internal_helper()` |
| Name mangled (see [[Encapsulation-and-Properties]]) | leading double underscore | `__secret` |

## Indentation and Line Length

```python
# 4 spaces per indentation level, never tabs
def func():
    if True:
        do_something()

# Max line length: 79 chars (strict PEP 8) or 88 (Black formatter default), team-dependent
```

## Whitespace Rules

```python
# Good
x = 1
y = x + 1
func(a, b, c)
d = {"key": "value"}

# Avoid
x=1
y = x+1
func( a,b,c )
d = { "key" : "value" }
```

```python
# Two blank lines before top-level function/class definitions
def first_function():
    pass


def second_function():
    pass


class MyClass:
    # One blank line between methods within a class
    def method_one(self):
        pass

    def method_two(self):
        pass
```

## Imports

```python
# Standard library first, then third-party, then local application imports, each group separated by a blank line
import os
import sys

import requests
import pandas as pd

from my_package import my_module
```

> [!tip] One import per line for `import`, grouping allowed for `from`
> ```python
> import os
> import sys              # preferred over: import os, sys
>
> from typing import List, Dict, Optional     # fine to group in a single from-import
> ```

## Comparisons

```python
# Good
if x is None:
    ...
if not items:
    ...

# Avoid
if x == None:
    ...
if len(items) == 0:
    ...
```

## String Quotes

PEP 8 doesn't mandate single vs double quotes, just consistency. Most modern tooling (Black) defaults to double quotes.

## Docstring Conventions

```python
def calculate_total(items, tax_rate=0.0):
    """Calculate the total cost including tax.

    Args:
        items: List of item prices.
        tax_rate: Tax rate as a decimal (e.g. 0.08 for 8%).

    Returns:
        The total cost as a float.
    """
    subtotal = sum(items)
    return subtotal * (1 + tax_rate)
```

## Automated Tooling (Do This Instead of Manual Checking)

```bash
pip install black flake8 isort ruff

black my_file.py         # auto-formats code to a consistent style
isort my_file.py            # auto-sorts and groups imports
flake8 my_file.py              # lints for PEP 8 violations and common errors
ruff check my_file.py             # fast, modern linter, increasingly replacing flake8
```

> [!tip] Don't manually enforce style, automate it
> Running `black` on save (most editors support this) means you never have to think about spacing or line-wrapping decisions again. Reserve mental effort for logic, not formatting.

## The Zen of Python

```python
import this
```

Prints PEP 20, a short list of guiding principles ("Beautiful is better than ugly", "Explicit is better than implicit", "Simple is better than complex", "Readability counts"). Worth reading once, genuinely.
