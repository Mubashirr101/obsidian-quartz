---
tags: [python, oop, classes]
aliases: [Python Classes, class, Objects]
---

# Classes and Objects

A class is a blueprint. An object (instance) is a concrete thing built from that blueprint, holding its own state.

## Defining a Class

```python
class Dog:
    species = "Canis familiaris"    # class attribute, shared by ALL instances

    def __init__(self, name, age):
        self.name = name              # instance attribute, unique per object
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"

rex = Dog("Rex", 3)
buddy = Dog("Buddy", 5)

rex.bark()          # 'Rex says Woof!'
rex.name              # 'Rex'
rex.species             # 'Canis familiaris', inherited from the class
```

## `self`: The Instance Reference

`self` is the first parameter of every instance method, referring to the specific object the method was called on. Python passes it automatically, `rex.bark()` is really `Dog.bark(rex)` under the hood.

```python
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self):
        self.count += 1     # 'self' is how the method reaches into ITS OWN data

c1 = Counter()
c2 = Counter()
c1.increment()
c1.increment()
print(c1.count, c2.count)     # 2 0  -- each instance has its own independent state
```

## `__init__`: The Constructor

Called automatically when a new instance is created. Its job is to set up initial state.

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

r = Rectangle(4, 5)
r.area()     # 20
```

## Instance Attributes vs Class Attributes

```python
class Employee:
    company = "Acme"        # class attribute: ONE copy shared across all instances

    def __init__(self, name):
        self.name = name       # instance attribute: separate per instance

e1 = Employee("Bob")
e2 = Employee("Amy")

Employee.company = "NewCo"     # changes the shared class attribute
print(e1.company, e2.company)    # NewCo NewCo, both see the change

e1.company = "Solo Inc"            # creates a NEW instance attribute on e1 ONLY,
                                       # shadows the class attribute for e1 alone
print(e1.company, e2.company)         # Solo Inc NewCo
```

> [!warning] Mutable class attributes are shared and dangerous
> ```python
> class Team:
>     members = []     # DANGER: shared list across ALL Team instances
>
>     def add(self, name):
>         self.members.append(name)
>
> t1 = Team()
> t2 = Team()
> t1.add("Bob")
> print(t2.members)     # ['Bob']  -- leaked into t2 as well!
> ```
> Fix: initialize mutable attributes inside `__init__`, not as class attributes.
> ```python
> class Team:
>     def __init__(self):
>         self.members = []
> ```

## Instance Methods

Regular methods take `self` and operate on/read instance state.

```python
class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance
```

## Checking and Inspecting Objects

```python
isinstance(rex, Dog)         # True
type(rex)                       # <class '__main__.Dog'>
hasattr(rex, "name")              # True
getattr(rex, "name")                 # 'Rex'
getattr(rex, "missing", "N/A")          # 'N/A', with default
setattr(rex, "age", 4)                    # equivalent to rex.age = 4
vars(rex)                                    # {'name': 'Rex', 'age': 4}, instance __dict__
```

## `__repr__` and `__str__` for Readable Objects

By default, printing an object shows an unhelpful memory address. Define `__repr__`/`__str__` to fix this. See [[Magic-Dunder-Methods]] for the complete list.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 4)
print(p)      # Point(3, 4), instead of <__main__.Point object at 0x...>
```

## Deleting Attributes and Objects

```python
del rex.age       # removes the 'age' attribute from the instance
del rex             # removes the reference; the object is garbage collected once unreferenced
```

## `__slots__`: Restricting Attributes for Memory Efficiency

By default, every instance carries a `__dict__` for arbitrary attribute storage. `__slots__` skips this, saving memory when creating many instances.

```python
class Point:
    __slots__ = ("x", "y")     # only these attributes are allowed, no others

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
p.z = 3        # AttributeError: 'Point' object has no attribute 'z'
```

> [!tip] When `__slots__` matters
> Worth using when creating millions of small objects (memory-sensitive data processing), rarely necessary for everyday application code.
