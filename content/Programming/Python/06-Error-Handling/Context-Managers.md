---
tags: [python, error-handling, context-managers, with-statement]
aliases: [Context Managers, "with" statement, "__enter__", "__exit__"]
---

# Context Managers

The `with` statement guarantees setup and cleanup code runs, even if an exception occurs in between. It is Python's answer to "always close this file/connection/lock, no matter what happens."

## The Problem Context Managers Solve

```python
# Manual, error-prone approach
f = open("data.txt")
data = f.read()
f.close()          # if an exception happens between open() and here, the file never closes!

# try/finally fixes the leak, but is verbose
f = open("data.txt")
try:
    data = f.read()
finally:
    f.close()         # guaranteed to run

# with statement: same guarantee, far cleaner
with open("data.txt") as f:
    data = f.read()
# file is automatically closed here, even if an exception was raised inside the block
```

## Multiple Context Managers

```python
with open("input.txt") as infile, open("output.txt", "w") as outfile:
    outfile.write(infile.read())
```

## Building a Custom Context Manager: Class-Based

Implement `__enter__` and `__exit__`.

```python
class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self                          # what 'as x' binds to

    def __exit__(self, exc_type, exc_value, traceback):
        import time
        self.elapsed = time.perf_counter() - self.start
        print(f"Elapsed: {self.elapsed:.4f}s")
        return False       # False (or None) means: don't suppress exceptions

with Timer() as t:
    sum(range(10_000_000))
```

### The `__exit__` Return Value Controls Exception Suppression

```python
class SuppressErrors:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is not None:
            print(f"Suppressed: {exc_value}")
        return True     # True means: swallow any exception, don't propagate it

with SuppressErrors():
    raise ValueError("this will be swallowed")
print("execution continues here normally")
```

> [!warning] Returning `True` from `__exit__` hides exceptions
> This is powerful but dangerous, silently suppressing errors makes bugs invisible. Only return `True` when you deliberately want to absorb a SPECIFIC known exception type, checked via `exc_type`, never blanket-suppress everything.

## Building a Context Manager: `@contextmanager` Decorator (Simpler)

Using a generator function is often less boilerplate than a full class.

```python
from contextlib import contextmanager
import time

@contextmanager
def timer():
    start = time.perf_counter()
    yield                        # code inside the 'with' block runs here
    elapsed = time.perf_counter() - start
    print(f"Elapsed: {elapsed:.4f}s")

with timer():
    sum(range(10_000_000))
```

Everything before `yield` is the setup (`__enter__` equivalent), everything after is the cleanup (`__exit__` equivalent). Handle exceptions with `try/finally` around the `yield`:

```python
@contextmanager
def open_resource(name):
    print(f"Opening {name}")
    try:
        yield name
    finally:
        print(f"Closing {name}")     # guaranteed cleanup, runs even if the block raises

with open_resource("database") as res:
    print(f"Using {res}")
```

## Real-World Standard Library Examples

```python
import threading
lock = threading.Lock()
with lock:                    # acquires the lock, guarantees release() even on exception
    critical_section()

from decimal import localcontext, Decimal
with localcontext() as ctx:
    ctx.prec = 2
    Decimal("1") / Decimal("3")     # uses precision 2 only inside this block

import contextlib
with contextlib.suppress(FileNotFoundError):
    import os
    os.remove("maybe_missing.txt")     # suppresses ONLY this specific exception type
```

> [!tip] `contextlib.suppress` vs try/except/pass
> `with contextlib.suppress(FileNotFoundError):` is a cleaner, more explicit way to write "ignore this specific exception if it happens" than a `try/except FileNotFoundError: pass` block.

## `contextlib.ExitStack`: Managing a Dynamic Number of Context Managers

```python
from contextlib import ExitStack

filenames = ["a.txt", "b.txt", "c.txt"]
with ExitStack() as stack:
    files = [stack.enter_context(open(fname)) for fname in filenames]
    # all files guaranteed closed when the with block exits, even though
    # the number of files wasn't known until runtime
```
