---
tags: [python, file-io]
aliases: [Python File Handling, open]
---

# File Handling

## Opening and Closing Files

```python
f = open("data.txt")     # opens in default mode: read text ('r')
content = f.read()
f.close()                    # MUST close manually if not using 'with'
```

> [!tip] Always use `with` for files
> ```python
> with open("data.txt") as f:
>     content = f.read()
> # file automatically closed here, even if an exception occurs inside the block
> ```
> See [[Context-Managers]] for why this guarantee matters.

## File Modes

| Mode | Meaning |
|---|---|
| `"r"` | Read (default), error if file doesn't exist |
| `"w"` | Write, CREATES the file or TRUNCATES (erases) an existing one |
| `"a"` | Append, creates if missing, writes go to the end |
| `"x"` | Exclusive create, errors if the file already exists |
| `"r+"` | Read and write, file must exist |
| `"rb"`, `"wb"` | Binary mode variants (images, pickled data, etc) |

> [!warning] `"w"` mode destroys existing content immediately
> Opening a file in `"w"` mode truncates it to zero bytes the moment it's opened, even before you write anything. If you meant to add to a file, use `"a"` instead.

## Reading

```python
with open("data.txt") as f:
    content = f.read()            # entire file as one string

with open("data.txt") as f:
    lines = f.readlines()           # list of lines, each including its trailing '\n'

with open("data.txt") as f:
    for line in f:                    # memory-efficient: reads one line at a time
        print(line.strip())              # .strip() removes the trailing newline

with open("data.txt") as f:
    first_line = f.readline()           # reads just one line
```

> [!tip] Iterating a file object directly is the most memory-efficient read pattern
> `for line in f:` never loads the whole file into memory at once, unlike `.read()` or `.readlines()`. Always prefer it for large files.

## Writing

```python
with open("output.txt", "w") as f:
    f.write("Hello\n")
    f.write("World\n")

with open("output.txt", "w") as f:
    f.writelines(["line1\n", "line2\n", "line3\n"])   # does NOT add newlines automatically

with open("output.txt", "a") as f:
    f.write("appended line\n")     # adds to the end without erasing existing content
```

## Text Encoding

```python
with open("data.txt", encoding="utf-8") as f:      # ALWAYS specify encoding explicitly
    content = f.read()
```

> [!warning] Don't rely on the platform default encoding
> Omitting `encoding=` uses the OS default, which differs across Windows/Linux/Mac and can cause `UnicodeDecodeError` when a file created on one system is read on another. Always pass `encoding="utf-8"` explicitly for text files.

## Reading/Writing Binary Files

```python
with open("image.png", "rb") as f:
    data = f.read()          # returns bytes, not str

with open("copy.png", "wb") as f:
    f.write(data)
```

## Checking File Existence Before Operating

```python
import os
if os.path.exists("data.txt"):
    with open("data.txt") as f:
        ...
```

Prefer `pathlib` for this in modern code, see [[Working-with-Paths-pathlib]].

## Handling Missing Files Gracefully

```python
try:
    with open("maybe_missing.txt") as f:
        content = f.read()
except FileNotFoundError:
    content = ""
    print("File not found, using empty default")
```

## Seeking and Telling (Random Access)

```python
with open("data.txt") as f:
    f.read(5)          # read first 5 characters
    f.tell()               # current position in the file, in bytes
    f.seek(0)                # move back to the beginning
```
