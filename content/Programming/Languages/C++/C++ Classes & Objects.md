---
title: C++ Classes & Objects
tags: [cpp, programming, oop, classes, objects, encapsulation]
aliases: [C++ OOP, C++ Encapsulation]
status: evergreen
---

# C++ Classes & Objects

## 🧠 What this note covers

A class is a blueprint describing both the data and the behavior that a particular kind of object should have, and an object is a specific, concrete instance actually created from that blueprint. This note covers defining classes, understanding access control, and the important distinction between a class and a struct, laying the foundation used throughout [[C++ Constructors & Destructors]], [[C++ Inheritance & Polymorphism]], and [[C++ Operator Overloading]].

## 🏛️ Defining a basic class

```cpp
class Student {
public:
    std::string name;
    int age;

    void introduce() {
        std::cout << "Hi, I'm " << name << " and I'm " << age << " years old" << std::endl;
    }
};

int main() {
    Student amit;
    amit.name = "Amit";
    amit.age = 21;
    amit.introduce();   // "Hi, I'm Amit and I'm 21 years old"
    return 0;
}
```

In this example, `Student` is the class itself, the blueprint, and `amit` is an object, a genuine, concrete instance actually created from that blueprint. The variables inside the class, `name` and `age`, are called "member variables" or "data members," and the function `introduce()` is called a "member function" or "method."

## 🔐 Access specifiers: public, private, and protected

C++ lets you explicitly control which parts of a class are accessible from outside the class itself, through three access specifiers.

```cpp
class BankAccount {
private:
    double balance;   // NOT accessible directly from outside the class

public:
    void deposit(double amount) {
        balance += amount;
    }

    double getBalance() {
        return balance;
    }
};

int main() {
    BankAccount account;
    account.deposit(100);
    std::cout << account.getBalance() << std::endl;   // works fine, through the public method

    // account.balance = 1000000;   // COMPILE ERROR, balance is private, cannot be accessed directly
    return 0;
}
```

> [!note] The meaning of each access specifier
> `public` members are freely accessible from anywhere the object itself is accessible, including entirely outside the class. `private` members are accessible only from within the class's own member functions themselves, not from outside code at all. `protected` members behave like `private` with one specific exception, they remain accessible to derived classes as well, a distinction that only becomes meaningful once inheritance, covered in [[C++ Inheritance & Polymorphism]], enters the picture.

> [!tip] Why hiding data behind private, accessed only through public methods, is genuinely valuable
> This overall pattern, called encapsulation, is one of the central, foundational ideas of object oriented programming. By keeping `balance` private and only allowing it to be modified through a controlled method like `deposit()`, the class itself can enforce its own internal rules, for instance rejecting a negative deposit amount, guaranteeing that the object can genuinely never end up in some invalid, nonsensical, broken internal state, regardless of how carelessly the surrounding code outside the class happens to use it.

## 🏗️ class versus struct: a smaller distinction than it might first appear

C++ also provides a `struct` keyword, largely inherited directly from C, which is functionally almost entirely identical to a `class` in modern C++, with exactly one meaningful default difference between the two.

```cpp
struct Point {
    int x;
    int y;
};

class Point2 {
    int x;
    int y;
};
```

> [!note] The one genuine difference: default access level
> The single meaningful difference between `struct` and `class` in C++ is that a `struct`'s members are `public` by default unless stated otherwise, while a `class`'s members are `private` by default unless stated otherwise. By long standing convention, `struct` tends to be reserved specifically for simple, largely passive data bundles with little or no associated behavior, such as a basic coordinate pair, while `class` tends to be reserved for more genuinely behavior rich types that also carefully manage their own internal, private state, though this remains purely a widely followed stylistic convention rather than a strict rule enforced by the language itself.

## 🧮 Member functions defined outside the class

For larger classes, it is common practice to only declare a member function's signature inside the class definition itself, and then provide its actual, full implementation separately, outside the class, using the scope resolution operator `::`.

```cpp
class Student {
public:
    std::string name;
    void introduce();   // just a DECLARATION here, inside the class
};

void Student::introduce() {   // the actual DEFINITION, provided separately, outside the class
    std::cout << "Hi, I'm " << name << std::endl;
}
```

> [!note] Why this separation is common in larger, real world projects
> This pattern directly mirrors the declaration versus definition separation already covered for ordinary functions in [[C++ Functions]], and serves a similar practical purpose in larger projects, letting a class's overall public interface be declared cleanly, concisely, and readably inside a header file, while its full, often much longer implementation details live separately inside a corresponding source file.

## 🎯 The this pointer

Inside any non-static member function, a special, implicitly available pointer named `this` refers directly back to the specific object the member function is currently actually being called on.

```cpp
class Student {
public:
    std::string name;

    void setName(std::string name) {
        this->name = name;   // this->name refers to the MEMBER variable, while plain name refers to the PARAMETER
    }
};
```

> [!tip] this is especially useful for resolving naming clashes like this one
> A very common, practical use of `this` is exactly the situation shown above, where a constructor or setter method's parameter is deliberately given the exact same name as the member variable it is meant to set, since that is very often the clearest, most natural name for both. Writing `this->name` makes it entirely explicit and unambiguous to the compiler, and to any reader, that you specifically mean the object's own member variable, rather than the locally scoped parameter that happens to share the identical name.

## 🧱 static members: shared across every single instance

A member variable or function marked `static` belongs to the class itself as a whole, rather than to any one individual object, meaning there is genuinely only ever one single shared copy, no matter how many separate objects of that class actually get created.

```cpp
class Student {
public:
    static int totalStudents;   // declared here, inside the class

    Student() {
        totalStudents++;   // every single new Student increments this ONE shared, common counter
    }
};

int Student::totalStudents = 0;   // static members must ALSO be separately defined, outside the class, exactly once

int main() {
    Student s1, s2, s3;
    std::cout << Student::totalStudents << std::endl;   // 3, accessed through the CLASS itself, not through any one object
    return 0;
}
```

> [!note] Why static members need a separate definition outside the class
> Simply declaring a `static` member inside the class only tells the compiler that such a shared variable will genuinely exist somewhere; it does not yet actually allocate any real storage space for it. A separate definition line outside the class, such as `int Student::totalStudents = 0;`, is required specifically to actually create the genuine, single, shared storage that every single instance of the class will then collectively share and refer to together.

## 🔗 Where to go next

Continue directly to [[C++ Constructors & Destructors]] to see how objects actually get properly initialized and cleaned up, or move to [[C++ Inheritance & Polymorphism]] to see how one class can build directly upon another, extending and specializing its behavior.
