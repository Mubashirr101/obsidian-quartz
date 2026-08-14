---
title: C++
tags: [cpp, programming, moc, index]
aliases: [C++ Programming, Cpp]
status: evergreen
---

# C++

## 👋 Introduction

C++ is a general purpose, statically typed, compiled programming language, originally created by Bjarne Stroustrup in the early 1980s as an extension of the C language, hence the name, where the `++` itself is a small programmer's joke referencing C's own increment operator. Where C gave programmers extremely close, low level control over hardware and memory with very little abstraction on top, C++ added object oriented programming, generic programming through templates, and a large standard library, while still preserving that same close-to-the-hardware performance and control that made C so influential in the first place.

C++ occupies a distinct and important place in the programming world. It is the language behind most modern game engines, including Unreal Engine, high frequency trading systems, operating system components, web browsers like Chrome and Firefox, and huge portions of performance critical infrastructure software. What makes C++ genuinely demanding to learn well is that it gives you enormous power and flexibility, including the ability to manage memory manually, but that same power means the language also gives you many more ways to make serious mistakes than a more restrictive, "safer" language typically would.

A central theme running through this entire folder is what is often called "zero overhead abstraction," the idea that C++ lets you write expressive, higher level code, such as using classes and templates, without paying a meaningful performance cost compared to writing the equivalent lower level code by hand. Understanding how the language achieves this, and where the sharp edges genuinely are, is what this folder aims to build up over its notes.

> [!note] Which C++ standard this folder assumes
> C++ has evolved considerably since its creation, released in numbered standard versions such as C++11, C++14, C++17, and C++20, each one adding significant new features. This folder generally assumes a modern standard, C++11 and later, since the modern features covered here, such as smart pointers and range based loops, represent how C++ is genuinely written today, rather than the more manual, older style common in codebases written before 2011.

## 🧭 How this folder is organized

This folder begins with the fundamental building blocks shared with most procedural languages, moves into C++'s distinctive and often tricky memory model built around pointers and references, and then works up through object oriented programming, generic programming with templates, and the standard library, before finishing with more advanced modern features.

## Map of Content

### Foundations
- [[C++ Basics & Syntax]] - the overall shape of a C++ program, variables, and comments
- [[C++ Data Types & Variables]] - the built in types C++ offers and how they are declared
- [[C++ Operators & Expressions]] - arithmetic, comparison, logical, and assignment operators
- [[C++ Control Flow]] - if/else statements, loops, and switch statements

### Functions and data structures
- [[C++ Functions]] - declaring, defining, and overloading functions
- [[C++ Arrays & Strings]] - fixed size collections and text handling in C++

### The memory model
- [[C++ Pointers & References]] - the two core mechanisms for indirectly referring to data
- [[C++ Memory Management]] - the stack, the heap, and manual allocation with new and delete
- [[C++ Smart Pointers]] - modern, safer alternatives to manual memory management

### Object oriented programming
- [[C++ Classes & Objects]] - bundling data and behavior together
- [[C++ Constructors & Destructors]] - controlling how objects are built and cleaned up
- [[C++ Inheritance & Polymorphism]] - building hierarchies of related types
- [[C++ Operator Overloading]] - giving your own types custom behavior for built in operators

### Generic programming and the standard library
- [[C++ Templates]] - writing code that works across many different types
- [[C++ STL Containers]] - the standard library's ready made data structures
- [[C++ STL Algorithms & Iterators]] - the standard library's ready made operations on data

### Robustness and modern features
- [[C++ Exception Handling]] - responding gracefully when something goes wrong
- [[C++ File Handling (I O Streams)]] - reading from and writing to files
- [[C++ Namespaces & Preprocessor Directives]] - organizing code and controlling compilation
- [[C++ Lambda Expressions & Move Semantics]] - modern, expressive features added in C++11 and beyond
- [[C++ Multithreading & Concurrency]] - running code across multiple threads at once

## 🚀 Quick reference: the shape of a C++ program

Before diving into the individual notes, here is a small example that touches several ideas covered across this folder, just to see how they connect.

```cpp
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> names = {"Amit", "Sara", "Wei"};

    for (const auto& name : names) {
        std::cout << "Hello, " << name << std::endl;
    }

    return 0;
}
```

> [!tip] Compiling and running a C++ program
> A C++ file, typically saved with a `.cpp` extension, needs to be compiled into an actual executable program before it can run, unlike an interpreted language such as Python. A common way to do this using the g++ compiler is `g++ myprogram.cpp -o myprogram`, followed by `./myprogram` to actually run the resulting compiled file. This compile step is exactly why errors in C++ often get caught before the program ever even runs, unlike a scripting language that might only discover a mistake once it reaches that specific line during execution.

## 🔗 Related folders in the vault

As this LORE vault grows, this C++ folder will naturally connect to folders on data structures and algorithms, systems programming, and any game development or embedded systems topics, since C++ forms the practical backbone underneath a great deal of that work.
