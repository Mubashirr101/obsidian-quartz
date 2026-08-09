---
tags: [python, oop, encapsulation, properties]
aliases: [Python Encapsulation, "@property", Getters and Setters]
---

# Encapsulation and Properties

Python has no true "private" access modifiers like Java's `private`. Instead it relies on naming conventions and the `@property` decorator.

## Naming Conventions

```python
class Account:
    def __init__(self, balance):
        self.balance = balance          # public: no restriction, freely accessible
        self._pin = "1234"                 # single underscore: "internal use", a CONVENTION only
        self.__secret_key = "xyz"            # double underscore: name-mangled (see below)
```

> [!info] Single underscore is a convention, not enforcement
> `self._pin` is still fully accessible from outside (`account._pin` works fine). It is a signal to other developers: "treat this as internal, do not rely on it externally."

## Name Mangling (Double Leading Underscore)

```python
class Account:
    def __init__(self):
        self.__secret = "hidden"

a = Account()
a.__secret          # AttributeError!
a._Account__secret     # 'hidden' -- name mangling renamed it internally to _ClassName__attr
```

> [!tip] Purpose of name mangling
> This exists mainly to avoid naming collisions in inheritance hierarchies, not to provide real privacy. It is still trivially bypassable, so do not treat it as a security boundary.

## `@property`: Computed Attributes with Getter Syntax

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return 3.14159 * self.radius ** 2      # computed on the fly, accessed like an attribute

c = Circle(5)
c.area          # 78.53975 -- called WITHOUT parentheses, like a plain attribute
```

## `@property` with a Setter: Validation on Assignment

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius     # goes through the setter below via the property

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value

c = Circle(5)
c.radius = 10       # goes through validation
c.radius = -3          # raises ValueError
```

> [!example] Why this pattern matters
> Callers still use plain attribute syntax (`c.radius = 10`), no getter/setter method calls needed like in Java (`c.setRadius(10)`). This lets you START with a plain public attribute, and LATER add validation via `@property` without breaking any existing code that uses `obj.attr` syntax.

## Read-Only Properties

Omit the setter to make an attribute read-only from outside the class.

```python
class Employee:
    def __init__(self, first, last):
        self._first = first
        self._last = last

    @property
    def full_name(self):
        return f"{self._first} {self._last}"

e = Employee("Bob", "Smith")
e.full_name           # 'Bob Smith'
e.full_name = "X"        # AttributeError: can't set attribute (no setter defined)
```

## `@<property>.deleter`

```python
class Circle:
    @property
    def radius(self):
        return self._radius

    @radius.deleter
    def radius(self):
        print("Deleting radius")
        del self._radius

c = Circle()
c._radius = 5
del c.radius     # prints 'Deleting radius'
```

## Encapsulation Philosophy in Python

> [!tip] "We are all consenting adults here"
> This is a well-known Python community phrase. Rather than strictly enforcing privacy, Python trusts developers to respect naming conventions. This makes introspection and debugging much easier (you can always poke at `_internal` attributes when needed) at the cost of relying on discipline rather than compiler enforcement.
