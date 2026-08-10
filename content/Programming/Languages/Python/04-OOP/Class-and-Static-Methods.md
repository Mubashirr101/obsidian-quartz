---
tags: [python, oop, classmethod, staticmethod]
aliases: [classmethod, staticmethod, Class Methods, Static Methods]
---

# Class and Static Methods

## Instance Methods (The Default)

Take `self`, operate on a specific instance's data.

```python
class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings

    def describe(self):        # instance method
        return f"Pizza with {self.toppings}"
```

## `@classmethod`

Takes `cls` (the class itself) instead of `self`. Commonly used for alternative constructors.

```python
class Pizza:
    def __init__(self, toppings):
        self.toppings = toppings

    @classmethod
    def margherita(cls):              # alternative constructor
        return cls(["mozzarella", "tomato"])

    @classmethod
    def pepperoni(cls):
        return cls(["mozzarella", "pepperoni"])

p1 = Pizza.margherita()      # calls Pizza(["mozzarella", "tomato"]) internally
p2 = Pizza.pepperoni()
```

> [!tip] Why use `cls` instead of hardcoding `Pizza`
> Using `cls(...)` instead of `Pizza(...)` means the method works correctly even for SUBCLASSES. `StuffedCrustPizza.margherita()` would correctly create a `StuffedCrustPizza`, not a plain `Pizza`, because `cls` refers to whichever class the method was actually called on.

## `@staticmethod`

Takes neither `self` nor `cls`. It is just a regular function that happens to live inside the class's namespace for organizational purposes.

```python
class MathUtils:
    @staticmethod
    def is_even(n):
        return n % 2 == 0

MathUtils.is_even(4)          # True, called on the class directly
MathUtils().is_even(4)          # also works, called on an instance
```

> [!tip] When to use `staticmethod` vs a plain module-level function
> Use `staticmethod` when the function is conceptually related to the class (grouping/namespacing) but does not need access to instance or class state. If it truly has nothing to do with the class, a plain function outside the class is often clearer.

## Comparison Table

| Decorator | First parameter | Access to instance state | Access to class state | Typical use |
|---|---|---|---|---|
| (none, instance method) | `self` | Yes | Yes (via `self.__class__`) | Normal behavior |
| `@classmethod` | `cls` | No | Yes | Alternative constructors, class-level operations |
| `@staticmethod` | none | No | No | Utility functions grouped under the class |

## Practical Example: Combining All Three

```python
class Employee:
    company = "Acme"
    raise_percent = 1.05

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def apply_raise(self):                          # instance method
        self.salary *= Employee.raise_percent

    @classmethod
    def set_raise_percent(cls, new_percent):           # classmethod: modifies class-level state
        cls.raise_percent = new_percent

    @classmethod
    def from_string(cls, employee_string):                # classmethod: alternative constructor
        name, salary = employee_string.split("-")
        return cls(name, float(salary))

    @staticmethod
    def is_workday(day):                                     # staticmethod: unrelated to instance/class state
        return day.weekday() < 5

Employee.set_raise_percent(1.10)
e = Employee.from_string("Bob-50000")
```
