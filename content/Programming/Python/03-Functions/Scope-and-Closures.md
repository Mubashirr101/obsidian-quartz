---
tags: [python, functions, scope, closures]
aliases: [Python Scope, LEGB, Closures, nonlocal]
---

# Scope and Closures

## The LEGB Rule

Python resolves a variable name by checking scopes in this order: **L**ocal -> **E**nclosing -> **G**lobal -> **B**uilt-in.

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)     # 'local'  -- found immediately in Local scope
    inner()
    print(x)          # 'enclosing'

outer()
print(x)                # 'global'
```

## Reading vs Assigning: The Core Rule

Reading a variable from an outer scope works automatically. ASSIGNING to a variable inside a function creates a new LOCAL variable by default, it does not modify the outer one, unless you explicitly declare otherwise.

```python
count = 0

def increment():
    count += 1     # UnboundLocalError! Python sees the assignment and treats
                     # count as local for the WHOLE function, so reading it
                     # before assignment fails.

increment()
```

## `global` Keyword

```python
count = 0

def increment():
    global count
    count += 1        # now modifies the global variable directly

increment()
print(count)             # 1
```

> [!warning] `global` is usually a design smell
> Reaching for `global` to mutate shared state is a common source of bugs in larger programs. Prefer passing values in and returning results out, or encapsulating shared state in a class. Reserve `global` for small scripts or genuine singletons like config or logging setup.

## `nonlocal` Keyword

Used inside a nested function to modify a variable in the ENCLOSING (not global) scope.

```python
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
counter()     # 1
counter()      # 2
counter()       # 3
```

## Closures

A closure is a function that remembers the values from its enclosing scope even after that outer function has finished executing.

```python
def make_multiplier(factor):
    def multiply(x):
        return x * factor    # 'factor' is remembered from the enclosing scope
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

double(5)      # 10
triple(5)        # 15
```

> [!example] Closures are how "factory functions" work
> Each call to `make_multiplier` creates a NEW independent closure with its own `factor` value baked in. `double` and `triple` do not interfere with each other.

## Inspecting a Closure

```python
double.__closure__[0].cell_contents     # 2, the captured 'factor' value
```

## The Classic Late-Binding Closure Bug

```python
funcs = []
for i in range(3):
    funcs.append(lambda: i)     # all three lambdas share the SAME 'i' variable

[f() for f in funcs]              # [2, 2, 2]  -- NOT [0, 1, 2] as you might expect!
```

> [!warning] Closures capture variables, not values
> By the time the lambdas run, the loop has finished and `i` is `2` for all of them. Fix by capturing the current value as a default argument (defaults ARE evaluated immediately at definition time):
> ```python
> funcs = []
> for i in range(3):
>     funcs.append(lambda i=i: i)     # i=i binds the CURRENT value now
>
> [f() for f in funcs]      # [0, 1, 2]
> ```

## Built-in Scope

Names like `len`, `print`, `range` live in the built-in scope, checked last. Shadowing them is legal but dangerous.

```python
list = [1, 2, 3]      # shadows the built-in list() type in this scope!
list((4, 5))             # TypeError: 'list' object is not callable
```

> [!warning] Never name a variable after a built-in
> Common offenders: `list`, `dict`, `str`, `type`, `id`, `input`, `sum`, `min`, `max`, `filter`, `format`. This silently breaks that name for the rest of the scope.
