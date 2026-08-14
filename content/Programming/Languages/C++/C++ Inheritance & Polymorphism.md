---
title: C++ Inheritance & Polymorphism
tags: [cpp, programming, inheritance, polymorphism, virtual-functions]
aliases: [C++ Virtual Functions, C++ Abstract Class]
status: evergreen
---

# C++ Inheritance & Polymorphism

## 🧠 What this note covers

Inheritance lets one class be built directly on top of another, inheriting its data and behavior while adding or changing its own. Polymorphism lets code work with objects of several genuinely related types through one single, shared, common interface, without needing to know the exact specific type it is dealing with at every single point. This note covers both, building directly on the class fundamentals from [[C++ Classes & Objects]].

## 🌳 Basic inheritance

```cpp
class Animal {
public:
    std::string name;

    Animal(std::string animalName) : name(animalName) {}

    void eat() {
        std::cout << name << " is eating" << std::endl;
    }
};

class Dog : public Animal {
public:
    Dog(std::string dogName) : Animal(dogName) {}   // calls the BASE class's constructor directly

    void bark() {
        std::cout << name << " says Woof!" << std::endl;
    }
};

int main() {
    Dog myDog("Rex");
    myDog.eat();    // inherited directly from Animal, "Rex is eating"
    myDog.bark();      // Dog's own, additional method, "Rex says Woof!"
    return 0;
}
```

Here, `Animal` is called the "base class" (or "parent class"), and `Dog` is called the "derived class" (or "child class"). `Dog` automatically inherits every one of `Animal`'s public members, and additionally defines new members entirely of its own.

> [!note] Why the derived class must explicitly call the base class's constructor
> Every single object, including a `Dog`, genuinely contains its complete `Animal` portion as an integral part of itself, and that inherited portion needs to be properly, correctly initialized too, exactly the same as any other member. This is precisely why `Dog`'s constructor explicitly calls `Animal(dogName)` inside its own member initializer list, ensuring the inherited `Animal` portion of the new `Dog` object gets constructed correctly and completely, before `Dog`'s own additional, specific setup work even begins.

## 🔐 public, protected, and private inheritance

The access specifier used when actually declaring the inheritance relationship itself, such as `class Dog : public Animal`, controls how the base class's own members are subsequently exposed within the derived class.

```cpp
class Dog : public Animal { };      // public inheritance, by far the most common in genuine practice
class Dog : protected Animal { };     // protected inheritance, rarely used in ordinary, everyday code
class Dog : private Animal { };         // private inheritance, also comparatively rare in everyday practice
```

> [!note] Public inheritance is the overwhelming default choice in real world code
> Public inheritance genuinely represents a true "is-a" relationship, meaning a `Dog` truly, meaningfully is a kind of `Animal`, and this is overwhelmingly the form of inheritance used in the vast majority of genuine, everyday C++ code. Protected and private inheritance model subtly different, much less common relationships, and are worth knowing exist, but are comparatively rare to actually encounter in typical, everyday application code.

## 🎭 Virtual functions and true polymorphism

By default, if a derived class defines a method with the exact same name as one already present in its base class, called "overriding" it, and you happen to be working through a base class pointer or reference, C++ will actually call the base class's own version, not the derived class's, unless the method was specifically marked `virtual`.

```cpp
class Animal {
public:
    virtual void makeSound() {
        std::cout << "Some generic animal sound" << std::endl;
    }
};

class Dog : public Animal {
public:
    void makeSound() override {   // "override" explicitly signals this is intentionally replacing the base version
        std::cout << "Woof!" << std::endl;
    }
};

int main() {
    Animal* animal = new Dog();
    animal->makeSound();   // prints "Woof!", NOT the generic base class version, precisely because it is virtual
    delete animal;
    return 0;
}
```

> [!warning] Without the virtual keyword, you get the wrong version through a base pointer
> Had `makeSound()` not been marked `virtual` in the base `Animal` class, the exact same code above would instead have printed the generic base class message, despite the pointer genuinely, actually pointing at a real `Dog` object underneath. This behavior, called "static binding" or "early binding," decides purely based on the pointer's own declared type at compile time, rather than the actual, real object it happens to be pointing at during actual runtime. Marking a function `virtual` switches this to "dynamic binding" or "late binding" instead, where C++ correctly checks the object's genuine, actual type at runtime instead, and this distinction is precisely the entire mechanism underlying true, meaningful polymorphism in C++.

> [!tip] Always use override on an intended overriding function
> Adding the `override` keyword, introduced in C++11, when defining a function meant to override a base class's virtual function is not strictly, technically required by the compiler to actually compile successfully, but it is a genuinely strong, widely recommended habit regardless. If your function's signature happens to not actually, precisely match the base class's virtual function exactly, perhaps due to a small, easy to miss typo or a subtly different parameter type, the compiler will immediately flag a clear, helpful error when `override` is present, rather than silently, quietly creating an entirely new, separate, unrelated function instead, which is a genuinely common and often quite confusing mistake to fall into without this safeguard.

## 🧮 Virtual destructors

> [!warning] A base class intended for polymorphic use genuinely needs a virtual destructor
> If a class is ever going to be deleted through a pointer to its base class, exactly as shown in the earlier `Animal* animal = new Dog();` example, and that base class's destructor is not itself marked `virtual`, then deleting through that base pointer will only actually run the base class's own destructor, entirely skipping the derived class's destructor altogether. If the derived class happens to be managing any of its own additional resources that genuinely need proper cleanup, such as further heap allocated memory of its own, this produces a genuine, real memory leak.

```cpp
class Animal {
public:
    virtual ~Animal() {}   // a virtual destructor, ensuring correct, complete cleanup through a base pointer
};

class Dog : public Animal {
public:
    ~Dog() override {
        std::cout << "Dog's destructor running" << std::endl;
    }
};
```

> [!tip] A strong, simple rule of thumb worth genuinely internalizing
> If a class has even a single `virtual` function anywhere in it at all, it should almost always also have a `virtual` destructor, as a strong, general default habit. This single, simple, easy to follow rule avoids an entire, genuinely common and sometimes quite hard to spot category of subtle memory leak bugs in polymorphic C++ code.

## 🎨 Abstract classes and pure virtual functions

A pure virtual function is a virtual function that is deliberately given no actual implementation at all in the base class, explicitly forcing every single derived class to provide its own complete implementation instead. A class containing at least one pure virtual function becomes what is called an "abstract class," meaning it can genuinely never be instantiated directly on its own, only inherited from.

```cpp
class Shape {
public:
    virtual double area() = 0;   // pure virtual function, the "= 0" is what marks it as such

    virtual ~Shape() {}
};

class Circle : public Shape {
public:
    double radius;
    Circle(double r) : radius(r) {}

    double area() override {
        return 3.14159 * radius * radius;
    }
};

int main() {
    // Shape s;   // COMPILE ERROR, Shape is abstract, genuinely cannot be instantiated directly at all
    Circle c(5);
    std::cout << c.area() << std::endl;   // 78.53975
    return 0;
}
```

> [!note] Why abstract classes are genuinely useful
> An abstract class defines a shared, common interface, or contract, that every one of its derived classes is then required to genuinely fulfill, without the abstract base class itself needing to provide, or even really be able to sensibly provide, any single, one-size-fits-all default implementation. `Shape` itself has genuinely no single sensible way to calculate "the area," since that calculation is entirely, fundamentally dependent on the specific, concrete kind of shape actually involved, but every genuinely concrete shape deriving from it is now firmly, reliably guaranteed by the compiler itself to provide its own correct, working `area()` implementation.

## 🔗 Where to go next

With inheritance and polymorphism covered, continue to [[C++ Operator Overloading]] to see another core mechanism for customizing how your own classes genuinely behave, or move to [[C++ Templates]] to see an entirely different, complementary approach to writing genuinely reusable, generic code, one based on compile time genericity rather than runtime polymorphism.
