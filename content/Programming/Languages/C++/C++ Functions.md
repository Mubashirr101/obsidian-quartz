---
title: C++ Functions
tags: [cpp, programming, functions, overloading]
aliases: [C++ Function Overloading]
status: evergreen
---

# C++ Functions

## 🧠 What this note covers

A function is a reusable, named block of code that performs a specific task, optionally accepting input and optionally producing a result. This note covers declaring and defining functions, default arguments, function overloading, and the important distinction between passing arguments by value and by reference, a concept that connects directly to [[C++ Pointers & References]].

## 🛠️ Declaring and defining a function

```cpp
int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 5);
    std::cout << result << std::endl;   // 8
    return 0;
}
```

Every function has a return type, listed at the very start, a name, and a parameter list inside parentheses describing what input it expects. A function that produces no result at all uses the special type `void`.

```cpp
void greet(std::string name) {
    std::cout << "Hello, " << name << std::endl;
    // no return statement needed, since this function returns nothing
}
```

## 📄 Function declarations versus definitions

In C++, it is entirely possible, and genuinely common, to separate a function's declaration, sometimes called its "prototype," describing only its name, return type, and parameters, from its actual definition, containing the real implementation.

```cpp
int add(int a, int b);   // a DECLARATION (prototype), just describes the function's signature

int main() {
    std::cout << add(3, 5) << std::endl;   // this works, since the compiler already knows add() exists
    return 0;
}

int add(int a, int b) {    // the actual DEFINITION, providing the real implementation
    return a + b;
}
```

> [!note] Why this separation exists at all
> C++ compiles source files largely from top to bottom, meaning a function generally needs to already be known to the compiler before it is actually called anywhere in the code. A forward declaration lets you reference a function earlier in a file than where its full implementation actually appears, and this same principle is exactly why header files, containing declarations, are separated from source files, containing definitions, in larger, multi file C++ projects.

## 🎛️ Default arguments

A function parameter can be given a default value, used automatically whenever the caller does not explicitly supply that particular argument.

```cpp
void greet(std::string name, std::string greeting = "Hello") {
    std::cout << greeting << ", " << name << std::endl;
}

greet("Amit");                // "Hello, Amit", uses the default greeting
greet("Amit", "Namaste");       // "Namaste, Amit", overrides the default
```

> [!warning] Default arguments must come after any non-default ones
> C++ requires that once a parameter has a default value, every parameter listed after it in the parameter list must also have a default value. Writing `void greet(std::string greeting = "Hello", std::string name)` would fail to compile, since the compiler would have no reliable way to determine, from a single argument call, whether that argument was meant to fill the first parameter or the second.

## 🔁 Function overloading

C++ allows multiple functions to share the exact same name, as long as their parameter lists genuinely differ, either in the number of parameters or in their types. This is called function overloading, and the compiler automatically determines which specific version to actually call based on the arguments provided at each individual call site.

```cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

std::string add(std::string a, std::string b) {
    return a + b;
}

add(3, 5);            // calls the int version
add(3.5, 2.1);           // calls the double version
add("Hello, ", "world");   // calls the std::string version
```

> [!note] How the compiler decides which overload to actually call
> This process, called "overload resolution," happens entirely at compile time, based purely on the number and types of the arguments actually supplied at each specific call site, not on anything happening at runtime. If the compiler genuinely cannot determine a single, unambiguous best matching overload for a given call, it produces a compile error rather than guessing, which is exactly why overloading, while convenient, still needs to be used thoughtfully to avoid genuinely ambiguous situations.

## 📦 Passing arguments: by value versus by reference

By default, C++ passes arguments "by value," meaning a completely separate copy of the argument is made and handed to the function, and any changes made inside the function have no effect at all on the original variable back where it was called from.

```cpp
void increment(int x) {
    x++;   // only modifies the LOCAL copy inside this function
}

int main() {
    int number = 5;
    increment(number);
    std::cout << number << std::endl;   // still prints 5, completely unchanged
    return 0;
}
```

To let a function actually modify the original variable, you pass it "by reference" instead, using an ampersand in the parameter declaration, a concept explored in full depth in [[C++ Pointers & References]].

```cpp
void increment(int& x) {
    x++;   // modifies the ORIGINAL variable directly, since x is a reference to it
}

int main() {
    int number = 5;
    increment(number);
    std::cout << number << std::endl;   // now prints 6
    return 0;
}
```

> [!tip] Pass by const reference for efficiency, without allowing modification
> For larger, more expensive to copy types, such as a `std::string` or a full custom class object, passing by value means an entire unnecessary copy gets made every single time the function is called, which can genuinely hurt performance. Passing by `const` reference, such as `void printName(const std::string& name)`, avoids that copy entirely, while the `const` keyword still fully prevents the function from actually modifying the original value, giving you the performance benefit of a reference together with the safety guarantee of pass by value.

## ➡️ Inline functions

The `inline` keyword suggests to the compiler that a function's actual code should be directly substituted at each individual call site, rather than performing a genuine, separate function call each time, which can improve performance for very small, frequently called functions by removing call overhead entirely.

```cpp
inline int square(int x) {
    return x * x;
}
```

> [!note] inline is only a suggestion, not a strict command
> Despite the name suggesting it forces inlining to actually happen, `inline` is genuinely only a hint given to the compiler, which remains entirely free to ignore it if it judges that inlining would not actually be beneficial in a particular case, such as for a function that turns out to be too large or too complex to sensibly duplicate at every single call site. Modern compilers are also already quite good at deciding when to inline a small function entirely on their own, even without the keyword being present at all, which is why `inline` is used somewhat more sparingly in modern C++ than it may have been historically.

## 🔗 Recursive functions

A function that calls itself, directly or indirectly, is called recursive, and is a natural fit for certain problems that can be broken down into smaller versions of the exact same problem.

```cpp
int factorial(int n) {
    if (n <= 1) {
        return 1;          // the "base case," stopping the recursion from continuing forever
    }
    return n * factorial(n - 1);   // the "recursive case," calling itself with a smaller input
}

factorial(5);   // 120
```

> [!warning] Every recursive function needs a genuine base case
> Without a proper base case that stops the recursion under some specific, reachable condition, a recursive function will keep calling itself indefinitely, eventually exhausting the program's call stack entirely and causing a crash, known as a "stack overflow." Always ensure that every recursive path genuinely leads toward the base case being reached eventually, for every possible valid input the function might receive.

## 🔗 Where to go next

Functions form the essential building block for everything more advanced ahead. Continue to [[C++ Pointers & References]] to understand pass by reference at a genuinely deeper level, or move to [[C++ Classes & Objects]] to see how functions become methods, bundled together directly with data.
