---
title: C++ Exception Handling
tags: [cpp, programming, exceptions, try-catch, error-handling]
aliases: [C++ try catch, C++ throw]
status: evergreen
---

# C++ Exception Handling

## 🧠 What this note covers

Exception handling is C++'s built in mechanism for responding to genuinely unexpected, exceptional situations that arise during a program's execution, such as attempting to divide by zero or accessing an invalid, out of bounds array index. This note covers the `try`, `catch`, and `throw` keywords, the standard library's own built in exception hierarchy, and a few genuinely important cautions around when exceptions are, and are not, the right, appropriate tool for the job.

## 🎣 try, catch, and throw

```cpp
double divide(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("Cannot divide by zero");
    }
    return a / b;
}

int main() {
    try {
        double result = divide(10, 0);
        std::cout << result << std::endl;
    } catch (const std::runtime_error& e) {
        std::cout << "An error occurred: " << e.what() << std::endl;
    }
    return 0;
}
```

Breaking this down: the `throw` statement immediately, actively signals that something has genuinely gone wrong, along with a genuine, specific exception object carrying details about precisely what happened. The `try` block wraps around any code that might potentially throw such an exception. The `catch` block specifically catches, and responds appropriately to, an exception of a genuinely matching type, if and only if one is actually, genuinely thrown anywhere within the corresponding `try` block.

> [!note] What genuinely happens when an exception is thrown
> The moment a `throw` statement genuinely executes, normal, ordinary program execution immediately stops dead in its tracks, right at that exact point, and control instead jumps directly to the nearest enclosing `catch` block capable of genuinely handling that specific, particular exception's actual type. If no such genuinely matching `catch` block can be found anywhere at all, the program terminates entirely, abruptly, and immediately, calling a special function named `std::terminate`.

## 🧾 The standard exception hierarchy

The standard library provides a small, genuinely well established, established hierarchy of exception types, all ultimately deriving from a common, single, shared base class, `std::exception`.

```cpp
#include <stdexcept>

std::runtime_error("message");      // for errors genuinely only detectable at runtime
std::logic_error("message");           // for errors that genuinely, in principle, could have been caught earlier
std::out_of_range("message");             // a specific, more precise kind of logic_error
std::invalid_argument("message");            // another specific, more precise kind of logic_error
```

> [!tip] Catching by base class reference lets you handle several related exception types at once
> Because every one of these standard exception types ultimately derives from `std::exception`, a single `catch (const std::exception& e)` block can genuinely, correctly catch any of them at all, directly relying on the exact same underlying polymorphism mechanism already covered in [[C++ Inheritance & Polymorphism]]. This becomes especially useful and convenient when you genuinely, deliberately want to handle several different, genuinely related kinds of error using one shared, common, consistent response, without needing to write out a genuinely separate, dedicated `catch` block for every single specific exception type individually.

```cpp
try {
    // code that might genuinely throw several different, related kinds of exception
} catch (const std::exception& e) {
    std::cout << "Error: " << e.what() << std::endl;
}
```

## 📚 Multiple catch blocks

You can chain together several separate `catch` blocks after a single `try`, allowing genuinely different, distinct exception types to each be handled with their own appropriately specific, tailored response.

```cpp
try {
    // some risky code here
} catch (const std::out_of_range& e) {
    std::cout << "Out of range error: " << e.what() << std::endl;
} catch (const std::invalid_argument& e) {
    std::cout << "Invalid argument error: " << e.what() << std::endl;
} catch (const std::exception& e) {
    std::cout << "Some other, more general error: " << e.what() << std::endl;
}
```

> [!warning] Order genuinely matters when you have multiple catch blocks
> C++ checks these `catch` blocks strictly, sequentially in the exact order they are actually written, and uses only the very first one that successfully, genuinely matches. Because every specific exception type here ultimately derives from `std::exception`, placing the broader, more general `catch (const std::exception& e)` block first would actually end up catching absolutely everything itself, silently preventing the more specific, genuinely more precisely tailored `catch` blocks written directly below it from ever actually being reached at all. Always place your more genuinely specific `catch` blocks first, before any broader, more general ones.

## 🎯 Creating and throwing your own custom exception types

You can, and very often genuinely should, define your own custom exception classes, by simply, directly inheriting from `std::exception` or from one of its own more specific, existing derived types.

```cpp
class InsufficientFundsError : public std::runtime_error {
public:
    InsufficientFundsError(const std::string& message)
        : std::runtime_error(message) {}
};

void withdraw(double balance, double amount) {
    if (amount > balance) {
        throw InsufficientFundsError("Not enough funds available for this withdrawal");
    }
}

int main() {
    try {
        withdraw(100, 500);
    } catch (const InsufficientFundsError& e) {
        std::cout << "Withdrawal failed: " << e.what() << std::endl;
    }
    return 0;
}
```

> [!tip] Why a genuinely custom exception type is often worth the small extra effort
> Defining your own dedicated, genuinely specific exception type, such as `InsufficientFundsError`, rather than simply reusing a generic `std::runtime_error` directly everywhere, lets calling code genuinely, precisely distinguish between meaningfully different kinds of failure through the type system itself, and specifically catch and handle only the exact particular ones it genuinely, actually cares about, rather than needing to inspect and manually parse the plain error message's text at runtime just to figure out what genuinely, actually went wrong.

## 🧹 Exceptions and RAII: the genuinely critical connection

> [!note] Why RAII matters especially, particularly here
> Since a thrown exception immediately, abruptly interrupts a function's genuinely normal, ordinary flow of execution, any resources that would otherwise have been carefully, manually cleaned up later, further down that same function, such as memory explicitly allocated with `new` as covered in [[C++ Memory Management]], risk genuinely never actually being properly released at all if an exception happens to be thrown before that specific cleanup code is ever actually reached. This is precisely, exactly why the RAII pattern, and smart pointers specifically, covered fully in [[C++ Smart Pointers]], matter so genuinely much in exception safe, robust C++ code, since a stack allocated object's own destructor is still fully, reliably guaranteed to run correctly during genuine "stack unwinding," the specific process of an exception actively propagating back up cleanly through the call stack, entirely regardless of whether the function actually returned completely normally or was instead abruptly interrupted partway through by a thrown exception.

```cpp
void riskyFunction() {
    std::unique_ptr<int> ptr = std::make_unique<int>(25);
    throw std::runtime_error("Something went wrong");
    // ptr's own destructor STILL runs correctly here, safely releasing the memory,
    // even though the function itself is genuinely being abruptly interrupted right here by the throw
}
```

## ⚠️ When exceptions genuinely are, and are not, the right tool

> [!warning] Exceptions carry a genuine, real performance cost, and are not meant for ordinary, everyday control flow
> Throwing and properly catching an exception is meaningfully, genuinely more expensive computationally than an ordinary function return or a simple conditional check, and exceptions are therefore specifically intended for genuinely exceptional, unusual situations, not for ordinary, routine, everyday control flow decisions. Using an exception purely to signal something entirely ordinary and fully expected, such as a search function simply, genuinely not finding a particular match, is generally considered poor, misguided practice. A more genuinely appropriate design in that specific case would typically instead return a special sentinel value, such as an iterator pointing at `.end()`, exactly as `std::find` itself already does in [[C++ STL Algorithms & Iterators]], reserving exceptions specifically, deliberately for situations that genuinely are truly exceptional and unexpected.

## 🔗 Where to go next

Exception handling connects directly and closely to safe, robust resource management, covered in [[C++ Smart Pointers]] and [[C++ Constructors & Destructors]]. Continue to [[C++ File Handling (I O Streams)]] to see exception handling applied directly, practically to real world file operations, or move to [[C++ Multithreading & Concurrency]] for a look at error handling in a genuinely more complex, concurrent context.
