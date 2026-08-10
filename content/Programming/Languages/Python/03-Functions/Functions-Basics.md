---
tags: [python, functions]
aliases: [Python Functions, def]
---

# Functions Basics

## Defining and Calling

```python
def greet(name):
    return f"Hello, {name}!"

greet("Zeltrax")     # 'Hello, Zeltrax!'
```

A function with no explicit `return` returns `None` implicitly.

```python
def log(message):
    print(message)

result = log("hi")     # prints 'hi'
print(result)             # None
```

## Default Arguments

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

greet("Bob")                    # 'Hello, Bob!'
greet("Bob", "Hey")               # 'Hey, Bob!'
greet("Bob", greeting="Hi")         # 'Hi, Bob!'
```

> [!warning] Mutable default arguments are a classic bug
> ```python
> def add_item(item, basket=[]):   # DANGER: default list is created ONCE at def time
>     basket.append(item)
>     return basket
>
> add_item("apple")    # ['apple']
> add_item("banana")   # ['apple', 'banana']  -- the SAME list persists across calls!
> ```
> Fix by using `None` as the sentinel default:
> ```python
> def add_item(item, basket=None):
>     if basket is None:
>         basket = []
>     basket.append(item)
>     return basket
> ```
> See [[Common-Pitfalls]] for more on this.

## Positional vs Keyword Arguments

```python
def describe(name, age):
    return f"{name} is {age}"

describe("Bob", 25)                 # positional
describe(name="Bob", age=25)          # keyword
describe(age=25, name="Bob")            # keyword args can be reordered
describe("Bob", age=25)                   # mixed, positional must come first
```

## Enforcing Argument Style: `/` and `*`

```python
def func(a, b, /, c, d, *, e, f):
    # a, b: positional-only (cannot be passed as keywords)
    # c, d: positional or keyword
    # e, f: keyword-only (must be passed as keywords)
    pass

func(1, 2, 3, 4, e=5, f=6)        # valid
func(a=1, b=2, c=3, d=4, e=5, f=6)  # TypeError, a and b are positional-only
func(1, 2, 3, 4, 5, 6)                # TypeError, e and f must be keyword
```

> [!tip] Why use `*` for keyword-only args
> Forcing keyword-only arguments (common in library APIs) makes call sites self-documenting: `create_user("bob", is_admin=True)` is far clearer than `create_user("bob", True)`.

## Return Values

```python
def divide(a, b):
    if b == 0:
        return None       # explicit early return
    return a / b

def min_max(nums):
    return min(nums), max(nums)     # returns a tuple, "multiple return values"

low, high = min_max([3, 1, 4])
```

## Docstrings

```python
def add(a, b):
    """
    Add two numbers together.

    Args:
        a (int or float): first number
        b (int or float): second number

    Returns:
        int or float: the sum of a and b
    """
    return a + b

print(add.__doc__)      # prints the docstring
help(add)                  # nicer formatted output in interactive shells
```

## Function Annotations (Type Hints on Functions)

```python
def add(a: int, b: int) -> int:
    return a + b
```

Annotations are not enforced at runtime by default, they are documentation and static-analysis hints. See [[Type-Hints-and-Typing]] for the full system.

## Functions Are First-Class Objects

Functions can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures.

```python
def shout(text):
    return text.upper()

my_func = shout          # assign function itself, no parens = no call
my_func("hi")               # 'HI'

def apply(func, value):
    return func(value)

apply(shout, "hello")         # 'HELLO'

operations = {"shout": shout, "len": len}
operations["shout"]("hi")       # 'HI'
```

See [[Lambda-Functions]], [[Decorators]], and [[Scope-and-Closures]] for how this first-class nature is used in practice.
