---
tags: [python, oop, abstract-classes, abc, interfaces]
aliases: [ABC, Abstract Base Class, Python Interfaces, Protocol]
---

# Abstract Classes and Interfaces

Python has no `interface` keyword. Abstraction is achieved through the `abc` module (Abstract Base Classes) or, more loosely, through `typing.Protocol` for structural typing.

## `abc.ABC` and `@abstractmethod`

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass                 # no implementation, subclasses MUST provide one

    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def perimeter(self):
        return 2 * 3.14159 * self.radius

Shape()          # TypeError: Can't instantiate abstract class Shape with abstract methods area, perimeter
c = Circle(5)       # works fine, all abstract methods implemented
```

> [!tip] Enforcement, not just convention
> Unlike a plain base class that merely raises `NotImplementedError` inside its methods (a common older-style pattern), `ABC` with `@abstractmethod` PREVENTS instantiation of any subclass that fails to override every abstract method. The error surfaces at instantiation time, not at first-use time.

## The Older Pattern (Still Seen, Weaker Guarantee)

```python
class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

class Circle(Shape):
    pass

c = Circle()      # instantiation succeeds! bug only surfaces when .area() is actually called
c.area()             # NotImplementedError, but only discovered at call time, not at creation time
```

## Abstract Properties

```python
from abc import ABC, abstractmethod

class Vehicle(ABC):
    @property
    @abstractmethod
    def max_speed(self):
        pass

class Car(Vehicle):
    @property
    def max_speed(self):
        return 200
```

## Mixing Abstract and Concrete Methods

An `ABC` can provide real, shared implementations alongside abstract requirements.

```python
from abc import ABC, abstractmethod

class Employee(ABC):
    def __init__(self, name):
        self.name = name

    def greet(self):                    # concrete, shared by all subclasses
        return f"Hi, I'm {self.name}"

    @abstractmethod
    def calculate_pay(self):              # abstract, each subclass must define
        pass

class SalariedEmployee(Employee):
    def __init__(self, name, salary):
        super().__init__(name)
        self.salary = salary

    def calculate_pay(self):
        return self.salary
```

## `typing.Protocol`: Structural Typing (Duck Typing, Statically Checked)

`Protocol` defines an interface based purely on what methods/attributes an object HAS, with no explicit inheritance required. This matches Python's duck-typing philosophy while still being checkable by static type checkers like mypy.

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str:
        ...

class Square:                # note: does NOT inherit from Drawable!
    def draw(self):
        return "Drawing a square"

def render(item: Drawable):
    print(item.draw())

render(Square())     # works, Square satisfies the Protocol structurally
```

> [!tip] `ABC` vs `Protocol`
> Use `ABC` when you control the class hierarchy and want to enforce a contract via explicit inheritance, with runtime enforcement. Use `Protocol` for structural/duck typing checked by static analysis tools, useful for third-party classes you cannot modify to inherit from your base class.

## Why Bother with Abstraction at All

> [!example] The real value
> Abstract classes let you write code against a CONTRACT ("anything that is a Shape has `.area()`") rather than a specific implementation. This is the foundation of extensible, polymorphic systems: new shapes can be added later without touching any code that already works with `Shape`.
