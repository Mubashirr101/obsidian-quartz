---
tags: [python, fundamentals, strings]
aliases: [Python Strings, str]
---

# Strings

Strings are immutable sequences of Unicode characters. Every operation that "modifies" a string actually returns a new string.

## Creating Strings

```python
s1 = 'single quotes'
s2 = "double quotes"
s3 = '''triple
quoted, spans
multiple lines'''
s4 = "It's fine to mix quote types to avoid escaping"
s5 = 'He said \"hello\"'   # escaping when needed
```

## Indexing and Slicing

```python
s = "Python"
s[0]        # 'P'
s[-1]       # 'n', negative index counts from the end
s[1:4]      # 'yth', slice is [start, stop)
s[:3]       # 'Pyt'
s[3:]       # 'hon'
s[::2]      # 'Pto', every 2nd character
s[::-1]     # 'nohtyP', reverses the string
```

## Common String Methods

```python
"  hello  ".strip()          # 'hello', removes leading/trailing whitespace
"Hello".lower()               # 'hello'
"Hello".upper()               # 'HELLO'
"hello world".title()         # 'Hello World'
"hello".capitalize()          # 'Hello'
"a,b,c".split(",")            # ['a', 'b', 'c']
"-".join(["a", "b", "c"])     # 'a-b-c'
"hello".replace("l", "L")     # 'heLLo'
"hello".startswith("he")      # True
"hello".endswith("lo")        # True
"hello".find("l")             # 2, index of first match, -1 if not found
"hello".count("l")            # 2
"hello".index("l")            # 2, like find but raises ValueError if missing
len("hello")                  # 5
"42".isdigit()                 # True
"hello".isalpha()              # True
"  ".isspace()                 # True
```

> [!tip] `find` vs `index`
> Use `find()` when the substring might be absent (returns -1). Use `index()` only when you are certain it exists, or you want an exception on failure.

## String Formatting

### f-strings (preferred, Python 3.6+)

```python
name = "Zeltrax"
age = 25
print(f"{name} is {age} years old")
print(f"{age * 2 = }")            # self-documenting: prints "age * 2 = 50"
print(f"{3.14159:.2f}")            # '3.14', formats to 2 decimal places
print(f"{1000000:,}")              # '1,000,000', thousands separator
print(f"{0.85:.1%}")                # '85.0%', percentage
print(f"{'hi':>10}")                # right align in a 10 char field
print(f"{'hi':<10}|")               # left align
print(f"{'hi':^10}|")               # center align
```

### `.format()` method

```python
"{} is {}".format(name, age)
"{0} is {1}, {0} again".format(name, age)   # positional reuse
"{n} is {a}".format(n=name, a=age)          # named
```

### Old style `%` formatting (legacy, still seen in older code)

```python
"%s is %d" % (name, age)
```

> [!tip] Prefer f-strings
> f-strings are the fastest and most readable option in modern Python. Use `.format()` only when the template string is built dynamically or reused across many calls.

## Immutability

```python
s = "hello"
s[0] = "H"   # TypeError: 'str' object does not support item assignment
s = "H" + s[1:]   # this is how you "change" a string, creates a new one
```

## Multiline Strings and Docstrings

```python
def greet():
    """
    This is a docstring.
    It describes what the function does and is accessible via greet.__doc__
    """
    pass
```

## Raw Strings

Prefix `r` disables escape sequence processing, essential for regex patterns and Windows file paths.

```python
path = r"C:\Users\name\Documents"    # backslashes are literal
pattern = r"\d+\.\d+"                 # regex, see [[Regular-Expressions]]
```

## String Encoding

```python
"hello".encode("utf-8")        # b'hello', str -> bytes
b"hello".decode("utf-8")       # 'hello', bytes -> str
```

> [!info]
> Python 3 strings are Unicode by default. `bytes` is a separate, distinct type used for raw binary data or encoded text, and the two cannot be mixed without explicit conversion.
