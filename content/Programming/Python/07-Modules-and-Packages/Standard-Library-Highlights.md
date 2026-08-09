---
tags: [python, standard-library]
aliases: [Python Standard Library, batteries included]
---

# Standard Library Highlights

Python ships with a large standard library ("batteries included"). This note covers the modules used often enough to be worth memorizing, beyond `collections`/`itertools`/`functools` (covered in their own notes).

## `datetime`: Dates and Times

```python
from datetime import datetime, date, timedelta

now = datetime.now()                       # current local date and time
today = date.today()                          # current date, no time component

d = datetime(2026, 8, 9, 14, 30)                # specific datetime
d.strftime("%Y-%m-%d %H:%M")                       # '2026-08-09 14:30', format as string
datetime.strptime("2026-08-09", "%Y-%m-%d")          # parse a string into a datetime

future = now + timedelta(days=7)                       # date arithmetic
diff = future - now                                       # timedelta object
diff.days                                                     # 7
```

| Format code | Meaning |
|---|---|
| `%Y` | 4-digit year |
| `%m` | 2-digit month |
| `%d` | 2-digit day |
| `%H`/`%M`/`%S` | hour/minute/second |
| `%A` | full weekday name |
| `%B` | full month name |

## `os` and `pathlib`: File System

```python
import os
os.getcwd()               # current working directory
os.listdir(".")              # list files in a directory
os.environ.get("HOME")         # read environment variables
os.path.join("a", "b", "c")      # 'a/b/c', OS-appropriate path joining
```

See [[Working-with-Paths-pathlib]] for the modern, preferred `pathlib` approach.

## `sys`: Interpreter-Level Access

```python
import sys
sys.argv                   # list of command-line arguments passed to the script
sys.exit(1)                    # exit the program with a status code
sys.path                          # module search path
sys.version                         # Python version string
```

## `json`: Serialization

```python
import json

data = {"name": "Bob", "age": 25}
json.dumps(data)                   # '{"name": "Bob", "age": 25}', dict -> JSON string
json.loads('{"a": 1}')                # {'a': 1}, JSON string -> dict
```

See [[Serialization-json-pickle-csv]] for file-based reading/writing.

## `re`: Regular Expressions

See the dedicated [[Regular-Expressions]] note.

## `random`

```python
import random

random.random()                  # float in [0.0, 1.0)
random.randint(1, 10)               # random int, INCLUSIVE of both endpoints
random.choice(["a", "b", "c"])         # random single element
random.sample([1, 2, 3, 4, 5], 3)         # 3 unique random elements, no repeats
random.shuffle(my_list)                       # shuffles in place
random.seed(42)                                  # makes randomness reproducible for testing
```

## `enum`: Named Constants

```python
from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    ACTIVE = auto()
    CLOSED = auto()

Status.ACTIVE              # <Status.ACTIVE: 2>
Status.ACTIVE.name            # 'ACTIVE'
Status.ACTIVE.value             # 2
Status.ACTIVE == Status.ACTIVE    # True
list(Status)                        # [Status.PENDING, Status.ACTIVE, Status.CLOSED]
```

> [!tip] `Enum` over magic strings/numbers
> Replacing `status = "active"` with `status = Status.ACTIVE` catches typos at development time (via IDE autocomplete and static analysis) rather than causing silent bugs at runtime from a misspelled string.

## `logging`: Proper Diagnostic Output (Instead of `print`)

```python
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

logger.debug("Detailed diagnostic info")       # not shown, below INFO level
logger.info("Something normal happened")
logger.warning("Something unexpected")
logger.error("Something failed")
logger.critical("Something severe")
```

> [!tip] `logging` over `print` for anything beyond a quick script
> `logging` supports severity levels, timestamps, output to files, and can be turned off/on globally without touching every call site, none of which `print()` offers.

## `argparse`: Command-Line Argument Parsing

```python
import argparse

parser = argparse.ArgumentParser(description="Process some files")
parser.add_argument("filename")                          # positional argument
parser.add_argument("--verbose", action="store_true")       # optional flag
parser.add_argument("--count", type=int, default=1)            # optional value

args = parser.parse_args()
print(args.filename, args.verbose, args.count)
```

## `subprocess`: Running Shell Commands

```python
import subprocess

result = subprocess.run(["ls", "-la"], capture_output=True, text=True)
result.stdout          # captured standard output as a string
result.returncode        # exit code, 0 usually means success
```

## `collections`: Beyond `Counter`/`defaultdict`

```python
from collections import deque, OrderedDict, ChainMap

dq = deque([1, 2, 3])
dq.appendleft(0)        # O(1) insertion at the front, unlike a list's O(n)
dq.popleft()               # O(1) removal from the front, great for queues

cm = ChainMap({"a": 1}, {"b": 2})    # views multiple dicts as one, first match wins
cm["a"]                                 # 1
```

> [!tip] `deque` for queue-like operations
> Use a `list` when you mostly append/pop from the END. Use a `deque` when you need efficient operations at BOTH ends (queues, sliding windows, undo/redo history).
