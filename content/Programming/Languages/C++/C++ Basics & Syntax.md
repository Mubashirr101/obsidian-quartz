---
title: C++ Basics & Syntax
tags: [cpp, programming, basics, syntax]
aliases: [C++ Syntax, C++ Fundamentals]
status: evergreen
---

# C++ Basics & Syntax

## 🧠 What this note covers

This note walks through the smallest building blocks of a C++ program: the overall structure every program shares, how to write comments, how to declare variables, and the compilation process that turns your written code into an actual runnable program. Think of this as the alphabet before forming full sentences with [[C++ Functions]] and [[C++ Control Flow]].

## 🧱 The structure of a minimal C++ program

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, world" << std::endl;
    return 0;
}
```

Breaking this down piece by piece:
- `#include <iostream>` is a preprocessor directive, telling the compiler to pull in the standard input and output library, needed here for `std::cout`. This is covered in more depth in [[C++ Namespaces & Preprocessor Directives]].
- `int main()` is the entry point of every C++ program. Execution always begins here, no matter how large or complex the rest of the program is.
- `std::cout << "Hello, world"` sends text to standard output, normally your terminal screen.
- `return 0;` ends the `main` function, and by strong convention, returning `0` signals that the program finished successfully.

> [!note] Why main must return an int
> Unlike most other functions you will write, which can return whatever type makes sense for their purpose, `main` is specifically required to return an `int`, since this value becomes the program's exit code, communicated back to whatever launched it, such as your terminal or a script. By long standing convention, a return value of `0` means success, and any nonzero value signals that some kind of error occurred, a convention shared with the shell scripting world covered elsewhere in this vault.

## 💬 Comments

```cpp
// This is a single line comment, ignored entirely by the compiler

/* This is a
   multi line comment,
   spanning several lines */

int x = 5; // A comment can also follow real code on the same line
```

> [!tip] Comment the why, not the what
> A comment like `// increment x by one` next to `x++;` does not add much value that the code did not already communicate clearly on its own. A more genuinely useful comment explains the reasoning behind a decision, such as `// using a raw loop here instead of an algorithm for clearer debugging output`.

## 📝 Declaring and initializing variables

```cpp
int age = 25;              // declares an integer variable and initializes it in one step
int score;                    // declares a variable WITHOUT initializing it, its value is undefined until assigned
score = 90;                     // assigns a value afterward, separately from declaration

int a = 5, b = 10, c = 15;         // multiple variables of the same type, declared together on one line
```

> [!warning] An uninitialized variable does not default to zero
> Unlike some languages that automatically give a fresh variable a sensible default value like 0, a plain uninitialized C++ variable like `int score;` contains whatever leftover, essentially random bits happened to already be sitting in that particular spot in memory. Reading from it before assigning a real value produces undefined behavior, a recurring and genuinely important concept in C++ meaning the compiler and language make absolutely no guarantees at all about what happens, and it is a very common, sometimes hard to spot, source of bugs. Always initialize a variable at the moment you declare it whenever practically possible.

### Modern initialization syntax

C++11 introduced a more consistent way to initialize variables, using curly braces, often called "brace initialization" or "uniform initialization."

```cpp
int age{25};           // brace initialization, the modern, generally recommended style
int score{};              // initializes to zero explicitly, rather than leaving it undefined
```

> [!tip] Why brace initialization is often preferred in modern code
> Beyond simply being more consistent looking across different contexts, such as initializing objects and arrays using the exact same syntax, brace initialization also protects against a specific class of subtle bug called "narrowing conversion," where a value that would lose information, such as assigning a decimal number into an integer variable, causes a compiler error with braces, whereas the older, traditional assignment syntax would often silently allow the risky truncation to happen without any warning at all.

## 🔢 Basic input and output

```cpp
#include <iostream>

int main() {
    int age;
    std::cout << "Enter your age: ";
    std::cin >> age;
    std::cout << "You are " << age << " years old" << std::endl;
    return 0;
}
```

> [!note] Reading the stream insertion and extraction operators
> The double less-than symbol `<<` is called the "stream insertion operator," and is used to send, or "insert," data into an output stream like `std::cout`. The double greater-than symbol `>>` is the "stream extraction operator," used to pull, or "extract," data out of an input stream like `std::cin`, into a variable. A helpful way to remember which is which is that the arrows visually point in the direction the data is actually flowing, out toward the screen for `<<`, and in from the keyboard for `>>`.

## 🏷️ Naming rules for identifiers

A variable, function, or class name in C++ can contain letters, digits, and underscores, but it cannot start with a digit, and names are case sensitive, meaning `age` and `Age` are treated as two entirely different identifiers.

```cpp
int student_age = 20;   // valid, uses underscores, common in traditional C++ style
int studentAge = 20;      // valid, "camelCase," also extremely common in modern C++ style
int 2ndAttempt = 3;         // invalid, cannot start with a digit
```

> [!tip] Consistency matters more than which specific style you pick
> C++ codebases vary quite a bit in their preferred naming convention, some favoring underscores, others favoring camelCase, and this is largely a matter of team or project convention rather than a strict language rule. What matters far more than which specific style you personally prefer is staying consistent throughout a single project, since mixing styles freely within the same codebase makes the code noticeably harder to read and maintain.

## ⚙️ Compilation: from source code to a running program

Unlike an interpreted language, where code is read and executed line by line as it runs, C++ code must first be compiled, a process that translates your human readable source code into machine code the processor can actually execute directly.

```bash
g++ program.cpp -o program    # compiles program.cpp into an executable file named "program"
./program                       # runs the resulting compiled executable
```

> [!note] Why compilation catches many errors before the program ever runs
> Because the compiler needs to fully understand your code's structure and types in order to translate it into machine code at all, a large category of mistakes, such as a genuine typo in a variable name or a fundamental type mismatch, gets caught immediately at compile time, before the program has ever actually run even once. This stands in real contrast to many interpreted languages, where a bug hiding in a rarely used code path might not surface until that exact path finally executes, potentially much later, in production.

## 🔗 Where to go next

Once these basics feel comfortable, move on to [[C++ Data Types & Variables]] to see the full range of built in types C++ offers, or jump to [[C++ Control Flow]] to start writing logic that makes decisions.
