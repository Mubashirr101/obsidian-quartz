---
title: C++ Lambda Expressions & Move Semantics
tags: [cpp, programming, lambda, move-semantics, rvalue-references, modern-cpp]
aliases: [C++ Lambda, C++ Move Semantics, rvalue reference]
status: evergreen
---

# C++ Lambda Expressions & Move Semantics

## 🧠 What this note covers

This note covers two of the most genuinely significant features introduced in C++11 and refined further in later standards: lambda expressions, a concise way to define small, throwaway functions directly inline, right where they are actually needed, and move semantics, a mechanism that lets C++ efficiently transfer ownership of a resource rather than needlessly, wastefully copying it. Both directly build on ideas already introduced throughout [[C++ Functions]], [[C++ Pointers & References]], and [[C++ Smart Pointers]].

## 🎯 Lambda expressions: functions defined directly inline

A lambda expression lets you define a small, often genuinely temporary, throwaway function directly at the exact point it is actually needed, without requiring a genuinely separate, fully named function declared elsewhere.

```cpp
auto add = [](int a, int b) {
    return a + b;
};

std::cout << add(3, 5) << std::endl;   // 8
```

Breaking down the syntax itself: `[]` is called the "capture clause," `(int a, int b)` is an ordinary parameter list, exactly like any regular function, and `{ return a + b; }` is the function's actual body.

> [!note] Where lambdas genuinely tend to shine the most
> Lambdas are especially, genuinely useful specifically as arguments passed directly into standard algorithms, exactly as already seen throughout [[C++ STL Algorithms & Iterators]], where defining a genuinely separate, fully named function purely for a single, one-off use elsewhere would feel like real, unnecessary, excessive ceremony for what is often just a very small, simple, throwaway piece of logic.

```cpp
std::vector<int> numbers = {5, 3, 8, 1, 9};

std::sort(numbers.begin(), numbers.end(), [](int a, int b) {
    return a > b;   // sorts in DESCENDING order, using this small inline lambda directly
});
```

## 📥 The capture clause: accessing surrounding variables

The square brackets at the very start of a lambda control precisely which surrounding, outer variables the lambda itself is actually allowed to genuinely access from within its own body.

```cpp
int threshold = 10;

auto isAboveThreshold = [threshold](int value) {
    return value > threshold;   // "captures" threshold BY VALUE, taking its own separate, independent copy
};

auto increment = [&threshold]() {
    threshold++;   // "captures" threshold BY REFERENCE, genuinely able to directly modify the ORIGINAL variable
};
```

| Capture syntax | Meaning |
|---|---|
| `[]` | Captures genuinely nothing at all from the surrounding scope |
| `[x]` | Captures `x` specifically by value, taking its own independent copy |
| `[&x]` | Captures `x` specifically by reference, directly referring to the original |
| `[=]` | Captures every single surrounding variable used, all by value |
| `[&]` | Captures every single surrounding variable used, all by reference |

> [!warning] Capturing by reference risks a genuine dangling reference if the lambda outlives its surrounding scope
> If a lambda captures a variable by reference, using `[&]` or `[&x]`, and that specific lambda itself happens to genuinely be called after the original variable it refers to has already gone out of scope and been destroyed, this produces exactly the same dangling reference problem already covered in [[C++ Pointers & References]]. This risk becomes especially real and genuinely worth being careful about whenever a lambda is being stored somewhere and potentially called back later, rather than being used and immediately, entirely discarded right there, in the very same, immediate expression it was originally created in.

## 🔗 std::function: storing a lambda as a genuine, first class value

`std::function` provides a way to genuinely store a lambda, or in fact any other callable thing at all, inside an ordinary variable, letting it be passed around, stored, and called later, exactly like any other genuine, ordinary value.

```cpp
#include <functional>

std::function<int(int, int)> operation = [](int a, int b) {
    return a + b;
};

std::cout << operation(3, 5) << std::endl;   // 8
```

> [!note] Reading the std::function type itself
> `std::function<int(int, int)>` describes a genuinely callable thing that itself accepts two `int` arguments and returns a single `int`, matching the exact same general shape you would otherwise describe with an ordinary function's own signature, covered originally in [[C++ Functions]]. `auto` remains the simpler, generally preferred choice when a lambda is only genuinely, immediately being used right away, in place, but `std::function` becomes genuinely necessary once you specifically need to store it as a genuine class member, or pass it around more broadly and flexibly as a value in its own right.

## 🔄 Move semantics: transferring ownership instead of needlessly copying

Move semantics let C++ efficiently, cleanly transfer the internal resources of a temporary or genuinely no longer needed object directly into a brand new one, entirely avoiding the real cost of making a genuine, full, separate copy.

```cpp
std::vector<int> createLargeVector() {
    std::vector<int> result(1000000, 0);
    return result;   // MOVED out efficiently, rather than genuinely, wastefully copied
}

std::vector<int> myVector = createLargeVector();
```

> [!note] Why this genuinely does not require an expensive, wasteful full copy at all
> Because `result` here is itself a purely temporary, local object, just about to genuinely go out of scope and be destroyed the instant the function actually returns, the compiler is fully, entirely free to simply transfer its own already existing internal data directly over to `myVector`, rather than genuinely allocating a whole separate copy of that data purely to then immediately discard the original right afterward. This exact optimization, made possible directly through move semantics, is precisely what allows a function to efficiently return even a genuinely very large container, such as this million element vector, without incurring anywhere near the real cost a naive, full, complete copy would otherwise, genuinely require.

## ➡️ rvalue references: the underlying mechanism itself

Move semantics is itself built directly on top of a distinct kind of reference, called an "rvalue reference," written using a genuine double ampersand, `&&`, which specifically, deliberately binds only to temporary values.

```cpp
void process(std::string&& s) {   // an rvalue reference parameter, only binds to genuine TEMPORARY values
    std::cout << "Processing a temporary: " << s << std::endl;
}

void process(const std::string& s) {   // an ordinary, standard reference, binds to genuine, existing, named values
    std::cout << "Processing an existing value: " << s << std::endl;
}
```

> [!note] lvalues versus rvalues
> An "lvalue" genuinely refers to something with an actual, real, identifiable, persistent location in memory, such as an ordinary, genuinely named variable. An "rvalue" instead refers to a genuinely temporary value, without any such lasting, persistent identity of its own, such as the direct, immediate result of an expression like `a + b`, or a literal value like `42`. This lvalue versus rvalue distinction is precisely what lets the compiler correctly, reliably tell apart a case that is genuinely safe to efficiently move data out of, since nothing else could possibly still be relying on that same specific temporary value afterward, from a case where a genuine, full, real, independent copy remains the only truly safe, correct option.

### The move constructor and move assignment operator

A class can define its own custom move constructor and move assignment operator, directly extending the Rule of Three, already covered in [[C++ Constructors & Destructors]], into what is commonly called the "Rule of Five."

```cpp
class Buffer {
private:
    int* data;
    size_t size;

public:
    Buffer(Buffer&& other) noexcept : data(other.data), size(other.size) {
        other.data = nullptr;   // leaves the original, source object in a valid, but genuinely now empty, state
        other.size = 0;
    }

    ~Buffer() {
        delete[] data;
    }
};
```

> [!tip] Why the moved-from object must genuinely be left in a valid, safe state afterward
> After a move genuinely occurs, the original source object, `other` in this specific example, is still fully, entirely guaranteed to eventually have its own destructor run on it later, exactly as normal. Setting `other.data` to `nullptr` here ensures that when that later destructor eventually does run, calling `delete[]` on an already fully "moved-from," now-empty `nullptr` remains genuinely, completely safe, rather than accidentally, dangerously attempting to delete the exact same underlying memory a genuine second time, which would otherwise directly risk the double deletion problem already covered in full in [[C++ Memory Management]].

## 🔗 Where to go next

With these modern features covered, you now have a genuinely solid, complete foundation across the entire language. Continue to [[C++ Multithreading & Concurrency]] to see how C++ extends into genuinely running code concurrently across multiple threads, or revisit the [[C++]] main note for the complete map of everything covered throughout this folder.
