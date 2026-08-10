---
tags: [python, fundamentals, syntax]
aliases: [Python Syntax]
---

# Syntax and Structure

Python uses indentation instead of braces to define blocks of code. This is not a style choice, it is a hard requirement of the language.

## Indentation

> [!warning] Whitespace matters
> Mixing tabs and spaces will raise a `TabError` or `IndentationError`. Configure your editor to insert 4 spaces per tab (PEP 8 standard).

```python
if True:
    print("this is inside the if block")
    print("still inside")
print("outside the block")
```

## Comments

```python
# This is a single line comment

"""
This is technically a multi-line string,
but when placed alone it is commonly used
as a multi-line comment or a docstring.
"""

x = 5  # inline comment
```

## Statements and Line Continuation

A statement normally ends at a newline. Python has no semicolons requirement, but they can be used to separate multiple statements on one line (discouraged).

```python
a = 1; b = 2; c = 3  # works, but avoid this in real code

total = 1 + 2 + 3 + \
        4 + 5  # backslash continues a line

total = (1 + 2 + 3 +
         4 + 5)  # parentheses are the preferred way to continue lines
```

## The `print()` Function

```python
print("Hello", "World")              # Hello World
print("Hello", "World", sep="-")     # Hello-World
print("Hello", end=" ")              # no newline after
print(f"Value is {42}")              # f-string formatting
```

> [!tip]
> `sep` and `end` are the two most useful keyword arguments on `print()` that beginners forget about.

## Identifiers and Naming Rules

- Must start with a letter or underscore, not a digit.
- Can contain letters, digits, underscores.
- Case sensitive: `age` and `Age` are different variables.
- Cannot be a reserved keyword (`class`, `for`, `import`, etc).

```python
_valid = True
valid_2 = True
2invalid = True   # SyntaxError
```

## Keywords

Python reserves certain words that cannot be used as identifiers. Check the current list programmatically:

```python
import keyword
print(keyword.kwlist)
```

## The Python Interpreter and Execution Model

Python is interpreted (technically compiled to bytecode then run on the CPython virtual machine). Files run top to bottom at import/execution time, which is why function and class definitions must appear before they are called (unless using certain deferred patterns).

```python
def greet():
    print("hi")

greet()  # must be defined above this line
```

## The `if __name__ == "__main__":` Pattern

Every Python module has a built-in `__name__` variable. When a file is run directly, `__name__` equals `"__main__"`. When imported, it equals the module's name.

```python
def main():
    print("Running as a script")

if __name__ == "__main__":
    main()
```

> [!example] Why this matters
> This pattern lets a file be both an importable module and a runnable script. Code inside the `if` block only executes when the file is run directly, not when another file imports it.

## PEP 8 in One Glance

- 4 spaces per indentation level.
- Max line length around 79 to 99 characters (many teams use 88, Black's default).
- `snake_case` for variables and functions, `PascalCase` for classes, `UPPER_CASE` for constants.

See [[PEP8-and-Style]] for the full breakdown.
