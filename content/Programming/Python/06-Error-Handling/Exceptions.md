---
tags: [python, error-handling, exceptions]
aliases: [Python Exceptions, try except, Exception Handling]
---

# Exceptions

## Basic try/except

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
```

## Catching Multiple Exception Types

```python
try:
    value = int(input("Enter a number: "))
    result = 10 / value
except ValueError:
    print("That wasn't a valid number")
except ZeroDivisionError:
    print("Cannot divide by zero")
except (TypeError, KeyError):        # group related exceptions in a tuple
    print("Type or key error")
```

## Catching the Exception Object

```python
try:
    open("missing.txt")
except FileNotFoundError as e:
    print(f"Error: {e}")
    print(type(e))          # <class 'FileNotFoundError'>
    print(e.args)              # arguments passed to the exception
```

## `else` and `finally`

```python
try:
    result = 10 / 2
except ZeroDivisionError:
    print("Error occurred")
else:
    print(f"Success: {result}")     # runs ONLY if no exception was raised
finally:
    print("This always runs")        # runs no matter what, even if an exception propagates
```

> [!tip] Why use `else` instead of just putting code after `try`
> Code in `try` that DOESN'T need to be protected from exceptions belongs in `else`. This narrows the `try` block to just the risky operation, so you don't accidentally catch exceptions from unrelated code and misattribute them.

## Catching Everything (Use Sparingly)

```python
try:
    risky_operation()
except Exception as e:            # catches almost all exceptions, but not SystemExit/KeyboardInterrupt
    print(f"Something went wrong: {e}")
```

> [!warning] Never use a bare `except:`
> ```python
> try:
>     risky_operation()
> except:                    # catches EVERYTHING, including KeyboardInterrupt and SystemExit
>     pass                     # silently swallows the real problem, makes debugging a nightmare
> ```
> Always catch a specific exception type, or at minimum `Exception` (not the bare form), and never silently `pass` without at least logging.

## Raising Exceptions

```python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

withdraw(100, 500)     # raises ValueError: Insufficient funds
```

## Re-raising

```python
try:
    risky_operation()
except ValueError as e:
    print(f"Logging error: {e}")
    raise            # re-raises the SAME exception, preserving the original traceback
```

## Exception Chaining

```python
try:
    parse_config()
except KeyError as e:
    raise RuntimeError("Config parsing failed") from e     # preserves original as __cause__
```

The `from e` explicitly links the new exception to its cause, so tracebacks show both "the original error" and "what it was translated into", instead of looking unrelated.

## The Built-in Exception Hierarchy (Abbreviated)

```
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- Exception
      +-- ArithmeticError
      |    +-- ZeroDivisionError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- ValueError
      +-- TypeError
      +-- AttributeError
      +-- FileNotFoundError (subclass of OSError)
      +-- OSError
      +-- RuntimeError
      +-- StopIteration
```

> [!tip] Catch the most specific exception you can
> Catching `LookupError` instead of both `IndexError` and `KeyError` separately works because both inherit from it, but obscures WHICH one occurred. Prefer specific exceptions unless you genuinely intend to handle a whole family the same way.

## Common Built-in Exceptions

| Exception | When it's raised |
|---|---|
| `ValueError` | Right type, wrong value (e.g. `int("abc")`) |
| `TypeError` | Wrong type entirely (e.g. `"a" + 5`) |
| `KeyError` | Missing dict key |
| `IndexError` | List/sequence index out of range |
| `AttributeError` | Object has no such attribute/method |
| `FileNotFoundError` | File path does not exist |
| `ZeroDivisionError` | Division or modulo by zero |
| `ImportError` / `ModuleNotFoundError` | Import fails |
| `StopIteration` | Iterator exhausted (usually handled internally by `for` loops) |
| `RuntimeError` | Generic runtime failure, catch-all when nothing more specific fits |

## Order of `except` Clauses Matters

```python
try:
    risky()
except Exception:          # WRONG ORDER: this catches everything first
    print("generic")
except ValueError:            # unreachable! Exception already caught it above
    print("specific")
```

> [!warning] Always order `except` clauses from most specific to most general
> Python checks `except` clauses top to bottom and uses the FIRST match. A broad `except Exception` placed before a specific `except ValueError` makes the specific clause dead code.
