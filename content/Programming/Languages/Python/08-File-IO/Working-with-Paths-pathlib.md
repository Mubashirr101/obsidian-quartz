---
tags: [python, file-io, pathlib]
aliases: [pathlib, Path objects]
---

# Working with Paths: pathlib

`pathlib` (Python 3.4+) is the modern, object-oriented way to handle filesystem paths, replacing most `os.path` string manipulation.

## Creating Path Objects

```python
from pathlib import Path

p = Path("data/files/report.txt")
p2 = Path.home()                    # user's home directory
p3 = Path.cwd()                        # current working directory
```

## Joining Paths with `/`

```python
base = Path("data")
full = base / "files" / "report.txt"    # 'data/files/report.txt', OS-appropriate separators
```

> [!tip] `/` replaces `os.path.join`
> `Path("data") / "files" / "report.txt"` is far more readable than `os.path.join("data", "files", "report.txt")` and produces a proper `Path` object, not just a string.

## Path Components

```python
p = Path("/home/user/documents/report.pdf")

p.name           # 'report.pdf'
p.stem              # 'report', filename without extension
p.suffix              # '.pdf'
p.parent                # Path('/home/user/documents')
p.parts                    # ('/', 'home', 'user', 'documents', 'report.pdf')
p.parents[0]                  # same as p.parent
p.parents[1]                    # Path('/home/user')
```

## Checking Existence and Type

```python
p = Path("data.txt")
p.exists()          # True/False
p.is_file()             # True if it's a regular file
p.is_dir()                # True if it's a directory
```

## Reading and Writing Without `open()`

```python
p = Path("data.txt")
content = p.read_text(encoding="utf-8")      # reads whole file as string, no 'with' needed
p.write_text("Hello\n", encoding="utf-8")       # writes, creates or overwrites

data = p.read_bytes()                              # binary read
p.write_bytes(b"raw data")                            # binary write
```

## Creating and Removing Directories/Files

```python
new_dir = Path("output/nested")
new_dir.mkdir(parents=True, exist_ok=True)     # creates all missing intermediate dirs, no error if exists

new_file = Path("output/log.txt")
new_file.touch(exist_ok=True)                     # creates an empty file if it doesn't exist

Path("old.txt").unlink(missing_ok=True)             # deletes a file, no error if already missing
Path("empty_dir").rmdir()                              # removes an EMPTY directory only
```

## Listing Directory Contents

```python
p = Path(".")
list(p.iterdir())                    # all direct children (files and dirs)
list(p.glob("*.py"))                   # all .py files in this directory
list(p.rglob("*.py"))                     # recursive: all .py files in this dir AND subdirs
```

## Absolute vs Resolved Paths

```python
p = Path("../data/file.txt")
p.resolve()      # fully resolved absolute path, with ../ and symlinks resolved out
p.absolute()        # absolute but does not resolve .. or symlinks
```

## Combining with `os` When Needed

```python
import os
str(Path("data.txt"))       # convert Path back to a plain string when a library needs one
os.fspath(Path("data.txt"))    # equivalent, more explicit intent
```

> [!tip] `pathlib` over `os.path` in new code
> `os.path` functions operate on plain strings and require chaining multiple function calls for anything nontrivial. `pathlib`'s `Path` objects bundle related operations as methods, are cross-platform correct by default, and read far more naturally.
