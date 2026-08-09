---
tags: [python, oop, inheritance, polymorphism]
aliases: [Python Inheritance, super(), MRO]
---

# Inheritance and Polymorphism

## Basic Inheritance

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "Some generic sound"

class Dog(Animal):            # Dog inherits from Animal
    def speak(self):            # overrides the parent's method
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

Dog("Rex").speak()      # 'Rex says Woof!'
Cat("Tom").speak()        # 'Tom says Meow!'
```

## `super()`: Calling the Parent's Implementation

```python
class Animal:
    def __init__(self, name, sound):
        self.name = name
        self.sound = sound

class Dog(Animal):
    def __init__(self, name):
        super().__init__(name, sound="Woof")   # reuse parent's setup logic
        self.tricks = []

rex = Dog("Rex")
rex.sound      # 'Woof'
```

> [!tip] Always call `super().__init__()` in a subclass
> Skipping it means the parent class never gets to set up its own state, which is a common source of subtle bugs where inherited attributes are simply missing.

## Polymorphism: Same Interface, Different Behavior

```python
animals = [Dog("Rex"), Cat("Tom"), Dog("Buddy")]
for animal in animals:
    print(animal.speak())     # each object responds according to its OWN class
```

This is the core value of inheritance: calling code does not need to know or care about the exact subclass, it just calls `.speak()` and trusts polymorphism to dispatch to the right implementation.

## `isinstance()` and `issubclass()`

```python
isinstance(rex, Dog)         # True
isinstance(rex, Animal)        # True, Dog IS-A Animal
issubclass(Dog, Animal)          # True
issubclass(Animal, Dog)            # False
```

## Multiple Inheritance

Python supports inheriting from more than one class.

```python
class Swimmer:
    def swim(self):
        return "swimming"

class Flyer:
    def fly(self):
        return "flying"

class Duck(Swimmer, Flyer):
    pass

d = Duck()
d.swim()     # 'swimming'
d.fly()        # 'flying'
```

## Method Resolution Order (MRO)

When multiple parent classes define the same method, Python uses the C3 linearization algorithm to decide which one wins.

```python
class A:
    def greet(self):
        return "A"

class B(A):
    def greet(self):
        return "B"

class C(A):
    def greet(self):
        return "C"

class D(B, C):
    pass

D().greet()      # 'B', because B comes first in D's inheritance list
D.__mro__          # (D, B, C, A, object), the search order Python follows
```

> [!tip] Inspect the MRO when multiple inheritance gets confusing
> `ClassName.__mro__` or `ClassName.mro()` shows the exact left-to-right, depth-first-then-merged order Python uses to resolve attribute and method lookups. This resolves nearly every "which parent's method actually ran" question.

## Abstract Base Classes as a Safer Alternative

Deep multiple inheritance hierarchies get hard to reason about. Mixins and `ABC` (see [[Abstract-Classes-and-Interfaces]]) are generally cleaner patterns than deep diamond inheritance.

## Mixins

A mixin is a small class designed purely to be combined with others, adding a specific piece of reusable behavior, never meant to be instantiated alone.

```python
class JSONSerializableMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class User(JSONSerializableMixin):
    def __init__(self, name, age):
        self.name = name
        self.age = age

User("Bob", 25).to_json()     # '{"name": "Bob", "age": 25}'
```

## Extending Built-in Types

```python
class LoggedList(list):
    def append(self, item):
        print(f"Appending {item}")
        super().append(item)

ll = LoggedList()
ll.append(1)     # prints 'Appending 1', then behaves like a normal list
```

## Checking If a Method Was Overridden

```python
class Base:
    def method(self):
        pass

class Child(Base):
    def method(self):
        pass

"method" in Child.__dict__     # True, Child defines its own version
"method" in Base.__dict__         # True, Base defines its own too
```
