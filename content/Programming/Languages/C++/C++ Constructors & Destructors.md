---
title: C++ Constructors & Destructors
tags: [cpp, programming, constructors, destructors, raii]
aliases: [C++ Constructor, C++ Destructor]
status: evergreen
---

# C++ Constructors & Destructors

## 🧠 What this note covers

A constructor is a special member function that runs automatically whenever a new object is created, responsible for properly setting up, or "initializing," that object's internal state. A destructor is its counterpart, running automatically whenever an object is destroyed, responsible for any necessary cleanup. This note covers both in depth, building directly on the class fundamentals from [[C++ Classes & Objects]], and forming the practical basis for the RAII pattern already introduced in [[C++ Memory Management]].

## 🏗️ The default constructor

If you do not explicitly define any constructor at all, the compiler automatically generates a simple default one for you, taking no arguments, though it typically leaves ordinary member variables of primitive types genuinely uninitialized.

```cpp
class Student {
public:
    std::string name;
    int age;
};

Student s;   // uses the compiler generated default constructor
```

## 🛠️ Writing your own constructor

A constructor shares its exact name with the class itself, and, notably, has no return type at all, not even `void`.

```cpp
class Student {
public:
    std::string name;
    int age;

    Student(std::string studentName, int studentAge) {
        name = studentName;
        age = studentAge;
    }
};

Student amit("Amit", 21);   // calls your custom constructor directly, passing both required arguments
```

> [!warning] Once you define any constructor yourself, the compiler generated default one disappears entirely
> The moment you write even a single constructor of your own for a class, the compiler stops automatically generating the simple, no-argument default constructor it would otherwise have provided. This means `Student s;` (with no arguments at all) would now fail to compile at all, unless you also separately, explicitly define a genuine no-argument constructor of your own alongside the other one. This is a very common early surprise for people first writing custom constructors.

## ✅ Member initializer lists

While assigning member variables directly inside the constructor's body works, C++ offers a more idiomatic, and in several genuine cases more efficient, alternative called a member initializer list.

```cpp
class Student {
public:
    std::string name;
    int age;

    Student(std::string studentName, int studentAge)
        : name(studentName), age(studentAge) {
        // the constructor's body can now be empty, or handle other, genuinely separate setup logic
    }
};
```

> [!tip] Why initializer lists are generally preferred over plain assignment inside the body
> Using a member initializer list genuinely initializes each member variable directly, in a single step, whereas assigning inside the constructor's body first default constructs the member and only afterward assigns a new value to it, technically performing the work twice. For simple types like `int` this difference in overhead is negligible, but for more complex member types, such as another full class or a `std::string`, it can represent a genuine, measurable, avoidable performance cost. Beyond the performance angle, initializer lists are also required, not merely preferred, for initializing `const` member variables and reference type member variables, since neither of those can legally be assigned to at all after the object has already been constructed.

## 🎯 The default (parameterless) constructor, explicitly

```cpp
class Student {
public:
    std::string name = "Unknown";
    int age = 0;

    Student() {
        // explicitly provided, even though it does very little here
    }

    Student(std::string studentName, int studentAge)
        : name(studentName), age(studentAge) {
    }
};

Student s1;                  // uses the explicit default constructor
Student s2("Amit", 21);         // uses the parameterized constructor
```

> [!note] Constructor overloading works exactly like ordinary function overloading
> Just as with ordinary functions, covered in [[C++ Functions]], a class can define several different constructors at once, as long as their parameter lists genuinely differ from one another, and the compiler automatically selects the correct one to actually call, based on the exact arguments provided at each specific point an object gets created.

## 📋 The copy constructor

A copy constructor defines exactly what should happen when a brand new object is created directly as a copy of an already existing object of the exact same type.

```cpp
class Student {
public:
    std::string name;

    Student(std::string studentName) : name(studentName) {}

    Student(const Student& other) : name(other.name) {   // the copy constructor
        std::cout << "A copy was made" << std::endl;
    }
};

Student s1("Amit");
Student s2 = s1;   // invokes the copy constructor, since s2 is being freshly created directly FROM s1
```

> [!note] When the compiler generated default copy constructor is not actually good enough
> If you do not define your own copy constructor, the compiler automatically generates one that simply copies each member variable individually, one at a time, a process called a "shallow copy." This default behavior works perfectly well for genuinely simple classes, but becomes a genuine, serious problem for any class that itself manages a raw pointer or some other resource directly, since a plain, simple shallow copy would create two entirely separate objects that both mistakenly believe they alone own, and are each separately responsible for cleaning up, the exact same single underlying resource, a direct path straight toward the double deletion problem already covered in [[C++ Memory Management]].

## 🧹 The destructor

A destructor runs automatically the moment an object is destroyed, whether that happens because a stack allocated object has simply gone out of scope, or because `delete` was explicitly called on a heap allocated one.

```cpp
class Student {
public:
    std::string name;

    Student(std::string studentName) : name(studentName) {
        std::cout << name << " has been created" << std::endl;
    }

    ~Student() {   // the destructor, named identically to the class but prefixed with a tilde
        std::cout << name << " has been destroyed" << std::endl;
    }
};

void createStudent() {
    Student s("Amit");
}   // s automatically, immediately goes out of scope right HERE, and its destructor runs at exactly this point
```

> [!tip] This is the exact mechanism underlying RAII
> The destructor's guaranteed, entirely automatic invocation the moment an object goes out of scope is precisely the underlying mechanism that makes the RAII pattern, first introduced in [[C++ Memory Management]] and used throughout [[C++ Smart Pointers]], actually work. A class like `std::unique_ptr` simply calls `delete` on its internally managed raw pointer directly inside its own destructor, and because that destructor is entirely guaranteed to run automatically once the `unique_ptr` object itself goes out of scope, the underlying memory ends up being reliably, automatically released without you ever needing to think about it explicitly, every single time.

> [!note] A destructor never accepts parameters and can never be overloaded
> Unlike constructors, which can be freely overloaded in as many different variations as genuinely needed, a class can have exactly one, single destructor, and it never accepts any parameters at all, since destruction, unlike construction, is never given any extra information to actually work with, it simply cleans up whatever the object already, currently contains.

## 🔗 The Rule of Three (and the Rule of Five)

If a class needs to define any one of the following three special member functions itself, it very likely genuinely needs to define all three of them: the destructor, the copy constructor, and the copy assignment operator.

```cpp
class Student {
public:
    Student(const Student& other);                // copy constructor
    Student& operator=(const Student& other);         // copy assignment operator
    ~Student();                                          // destructor
};
```

> [!note] Why these three genuinely tend to travel together
> This guideline, widely known simply as the "Rule of Three," exists because needing to write a custom destructor at all is usually itself a strong, reliable signal that your class is directly managing some resource, such as raw allocated memory, that requires genuinely careful, deliberate handling. That exact same resource almost always also needs careful, deliberate handling during both copying and destructor cleanup, which is precisely why all three tend to naturally need custom implementations together, as a genuinely related, coordinated group. Modern C++11 and later code often extends this into the "Rule of Five," additionally including the move constructor and move assignment operator, both covered fully in [[C++ Lambda Expressions & Move Semantics]].

## 🔗 Where to go next

With object lifecycle covered, continue to [[C++ Inheritance & Polymorphism]] to see how these same underlying lifecycle concepts extend naturally into class hierarchies, or move to [[C++ Operator Overloading]] to see how objects can be given custom, natural behavior for familiar built in operators like `+` and `==`.
