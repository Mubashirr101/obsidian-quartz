---
tags: [python, best-practices, debugging]
aliases: [Python Debugging, pdb, Debugging Tips]
---

# Debugging Tips

## `print()` Debugging (The Baseline)

```python
def calculate(x, y):
    print(f"DEBUG: x={x}, y={y}")     # quick and dirty, but works everywhere
    result = x * y
    print(f"DEBUG: result={result}")
    return result
```

> [!tip] f-string debugging shortcut
> `print(f"{x = }")` (Python 3.8+) prints both the variable name and its value automatically: `x = 42`. Much faster to write than `print(f"x: {x}")` and self-documenting when reading logs.

## `pdb`: The Built-in Interactive Debugger

```python
import pdb

def buggy_function(x):
    pdb.set_trace()      # execution PAUSES here, drops into an interactive debugger
    result = x * 2
    return result
```

Or, cleaner in modern Python (3.7+):

```python
def buggy_function(x):
    breakpoint()      # same effect, the standard way to invoke pdb now
    result = x * 2
    return result
```

### Common `pdb` Commands

| Command | Effect |
|---|---|
| `n` (next) | Execute the current line, step over function calls |
| `s` (step) | Step INTO a function call |
| `c` (continue) | Resume execution until the next breakpoint |
| `l` (list) | Show surrounding source code |
| `p variable` | Print a variable's value |
| `pp variable` | Pretty-print a variable |
| `w` (where) | Show the current call stack |
| `q` (quit) | Exit the debugger |
| `h` (help) | List all commands |

## Using the Traceback Effectively

```python
def outer():
    inner()

def inner():
    return 1 / 0

outer()
```

```
Traceback (most recent call last):
  File "script.py", line 7, in <module>
    outer()
  File "script.py", line 2, in outer
    inner()
  File "script.py", line 5, in inner
    return 1 / 0
ZeroDivisionError: division by zero
```

> [!tip] Read tracebacks bottom to top
> The LAST line tells you the exception TYPE and message. The lines above it, read bottom-up, show the exact call chain that led there, so the frame closest to the actual failure is right above the exception message.

## Assertions as Sanity Checks

```python
def calculate_discount(price, discount_percent):
    assert 0 <= discount_percent <= 100, f"Invalid discount: {discount_percent}"
    return price * (1 - discount_percent / 100)
```

> [!warning] Never rely on `assert` for real validation in production code
> Running Python with the `-O` (optimize) flag strips out ALL `assert` statements entirely. Use `assert` only for catching programmer errors and invariants during development, never for validating untrusted user input or enforcing business logic that must always run.

## Logging Instead of Print (For Anything Beyond a Throwaway Script)

See [[Standard-Library-Highlights]] for the `logging` module in depth. Key advantage for debugging: log levels let you leave diagnostic statements in the code permanently, silent by default, and switch them on (`logging.DEBUG`) only when needed, without editing the source.

## Inspecting Objects Interactively

```python
dir(obj)              # list all attributes and methods
vars(obj)                # instance's __dict__, its actual attribute values
type(obj)                   # the object's class
obj.__class__.__mro__          # method resolution order, see [[Inheritance-and-Polymorphism]]
help(obj)                         # docstring and signature info
```

## Debugging in Jupyter/IPython

```python
%debug          # drops into pdb at the point of the LAST exception, after it already happened
%pdb on            # auto-launches the debugger on any future exception
```

## Common Bug Categories to Check First

> [!tip] Debugging checklist
> - Off-by-one errors in slicing/ranges (`range(n)` vs `range(n+1)`).
> - Mutable default arguments (see [[Common-Pitfalls]]).
> - Comparing floats with `==` instead of `math.isclose`.
> - Shadowing built-in names (`list`, `dict`, `str`).
> - Mixing up `is` and `==`.
> - Forgetting `self` doesn't get auto-passed when calling via the CLASS instead of an instance.
> - Late-binding closures in loops (see [[Scope-and-Closures]]).
