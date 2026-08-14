---
title: C++ Operator Overloading
tags: [cpp, programming, operator-overloading]
aliases: [C++ Overload Operators]
status: evergreen
---

# C++ Operator Overloading

## 🧠 What this note covers

Operator overloading lets you define exactly what a familiar, built in operator like `+`, `==`, or `<<` should actually do when it is applied directly to objects of your own custom class, rather than being limited only to C++'s own built in primitive types. This note covers how to write these overloads, and the genuine tradeoffs and pitfalls involved, extending directly on the class fundamentals from [[C++ Classes & Objects]].

## ➕ Overloading a basic arithmetic operator

```cpp
class Vector2D {
public:
    double x, y;

    Vector2D(double x, double y) : x(x), y(y) {}

    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }
};

int main() {
    Vector2D a(1, 2);
    Vector2D b(3, 4);
    Vector2D c = a + b;   // calls operator+ directly, entirely naturally, exactly like adding two plain numbers

    std::cout << c.x << ", " << c.y << std::endl;   // 4, 6
    return 0;
}
```

> [!note] Breaking down the function signature itself
> `operator+` is the special, specific function name C++ reserves for overloading the plus symbol. It takes a `const Vector2D&` parameter, representing the other operand being added, and is itself marked `const`, since adding two vectors together should never actually modify either one of the original vectors involved. It returns a brand new `Vector2D` by value, representing the freshly computed sum.

## 🔍 Overloading comparison operators

```cpp
class Vector2D {
public:
    double x, y;

    bool operator==(const Vector2D& other) const {
        return x == other.x && y == other.y;
    }

    bool operator!=(const Vector2D& other) const {
        return !(*this == other);   // implemented directly in terms of == , avoiding needless code duplication
    }
};
```

> [!tip] Implement related operators in terms of one another wherever genuinely possible
> Notice that `operator!=` here is implemented simply and directly by calling `operator==` and then negating the result, rather than independently, separately re-checking both `x` and `y` all over again from scratch. This is a genuinely good, widely followed habit, since it keeps the actual core comparison logic itself living in exactly one single place, meaning any future bug fix or refinement to the comparison logic only ever needs to be made in that one spot.

## 🖨️ Overloading the stream insertion operator

One of the most genuinely common and useful operators to overload for a custom class is `<<`, allowing your own objects to be printed directly and naturally with `std::cout`, exactly the same way built in types already can be.

```cpp
class Vector2D {
public:
    double x, y;
    Vector2D(double x, double y) : x(x), y(y) {}

    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v);
};

std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
    os << "(" << v.x << ", " << v.y << ")";
    return os;
}

int main() {
    Vector2D v(3, 4);
    std::cout << v << std::endl;   // prints "(3, 4)" directly, entirely naturally
    return 0;
}
```

> [!note] Why this specific overload must be a free function, not a member function
> Unlike `operator+`, which naturally reads as "the left hand object plus something," `operator<<` needs its very first, left hand side argument to genuinely be the `std::ostream` object itself, such as `std::cout`, not an instance of your own class. Since a genuine member function's implicit first parameter is always the object it was actually called on, `operator<<` therefore cannot correctly be written as an ordinary member function of `Vector2D` at all here, and must instead be written as a standalone, free function, declared as a `friend` of the class specifically so that it can still directly access the class's own genuinely private member variables if it happens to need to.

> [!tip] The friend keyword grants a controlled, deliberate exception to normal privacy rules
> Declaring a function as `friend` inside a class grants that specific, named function direct access to the class's own `private` and `protected` members, despite it technically not actually being a genuine member function of the class itself at all. This is used relatively sparingly and deliberately in well designed C++ code, precisely since it does meaningfully weaken normal encapsulation to some real, genuine degree, but the `operator<<` pattern shown above remains a very well established, widely accepted, and genuinely common legitimate use case for it.

## 🔢 Overloading the subscript operator

Overloading `operator[]` lets objects of your own custom class support the same, familiar square bracket indexing syntax already used by arrays and `std::vector`, covered in [[C++ Arrays & Strings]].

```cpp
class SimpleArray {
private:
    int data[10];

public:
    int& operator[](int index) {
        return data[index];
    }
};

int main() {
    SimpleArray arr;
    arr[0] = 5;                        // calls operator[], and assigns THROUGH the returned reference
    std::cout << arr[0] << std::endl;    // 5
    return 0;
}
```

> [!note] Why this specific overload needs to return a genuine reference
> `operator[]` here returns `int&`, a reference directly to the actual, real element inside the underlying array, rather than an ordinary copy of its value. This is precisely what allows `arr[0] = 5;` to actually work correctly at all, since the expression genuinely needs to refer to the real, original storage location itself, in order for an assignment made through it to have any lasting, genuine effect on the object afterward.

## ⚠️ A few genuine, important cautions around operator overloading

> [!warning] Do not overload an operator to mean something surprising or unintuitive
> While C++ technically allows you to define `operator+` to do genuinely anything at all, even something that has absolutely nothing conceptually to do with actual addition, doing so is considered extremely poor, confusing practice. The entire, whole point of operator overloading is to let your own custom class integrate naturally, intuitively, and predictably with code that already reads and reasons about it the same way it would about C++'s own familiar, built in types, and violating that reasonable, natural expectation makes code built on top of your class both genuinely harder to correctly understand and, worse, genuinely more likely to be subtly misused by mistake.

> [!tip] You do not need to overload every single operator for every single class
> It is entirely fine, and genuinely very common in real world code, to only overload the specific handful of operators that genuinely, meaningfully make clear conceptual sense for a given particular class. A `Vector2D` class overloading `+`, `-`, and `==` makes clear, obvious, intuitive sense, but there would be little to no genuine reason at all to overload something like `%` (modulo) for it, since that operation has no clear or natural mathematical meaning whatsoever in the context of two dimensional vectors.

## 🧮 Operators that cannot be overloaded

A handful of specific operators are deliberately not permitted to be overloaded at all in C++, most notably the member access operator `.`, the scope resolution operator `::`, the ternary conditional operator `?:`, and the `sizeof` operator.

> [!note] Why these particular few are deliberately excluded
> These specific operators are excluded from being overloadable largely because their precise, exact meaning is genuinely fundamental to how the language itself parses and understands code at the most basic, structural level, and allowing them to be redefined arbitrarily could make code's actual, real meaning and structure become genuinely, dangerously ambiguous or unpredictable to reliably parse and reason about at all.

## 🔗 Where to go next

Operator overloading connects naturally and directly to [[C++ Constructors & Destructors]] for properly managing any resources your overloaded operators might themselves need to correctly handle, such as within a genuine copy assignment operator. Continue to [[C++ Templates]] to see how generic, reusable code can be written to work correctly and naturally across many entirely different types at once, including ones that themselves make good, thoughtful use of operator overloading like this.
