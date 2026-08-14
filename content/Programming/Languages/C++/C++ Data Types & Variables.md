---
title: C++ Data Types & Variables
tags: [cpp, programming, data-types, variables]
aliases: [C++ Types]
status: evergreen
---

# C++ Data Types & Variables

## 🧠 What this note covers

C++ is a statically typed language, meaning every single variable must have a specific, known type, decided at compile time, and that type cannot later change. This note covers the built in, or "primitive," data types C++ offers, how much memory each one typically occupies, and the rules around type conversion between them.

## 🔢 The core primitive types

| Type | Typical size | Holds |
|---|---|---|
| `int` | 4 bytes | Whole numbers, both positive and negative |
| `float` | 4 bytes | Decimal numbers, single precision |
| `double` | 8 bytes | Decimal numbers, double precision, generally the default choice for decimals |
| `char` | 1 byte | A single character |
| `bool` | 1 byte | Either `true` or `false` |
| `void` | N/A | Represents the absence of a type entirely, commonly used for functions that return nothing |

```cpp
int age = 25;
double price = 19.99;
char grade = 'A';        // note the SINGLE quotes for a single character, not double quotes
bool passed = true;
```

> [!warning] Sizes are typical, not strictly guaranteed
> The C++ standard does not actually mandate an exact size in bytes for most primitive types, only a minimum guaranteed range they must be able to represent. The sizes listed above are extremely common on most modern desktop and server systems, but relying on an assumed exact size without verifying it, particularly when writing code meant to be portable across many different kinds of hardware, is a genuine and sometimes overlooked pitfall. The `sizeof()` operator, shown below, lets you check the actual size on your specific system directly.

```cpp
std::cout << sizeof(int) << std::endl;   // prints the actual size, in bytes, of int on this specific system
```

## ➕ Signed versus unsigned integers

Integer types can additionally be marked as `unsigned`, meaning they can only represent non-negative values, but in exchange gain a larger maximum positive range using the same number of bits.

```cpp
int signedNumber = -5;             // can represent both negative and positive values
unsigned int unsignedNumber = 5;      // can only represent zero and positive values
```

> [!warning] Mixing signed and unsigned values is a genuinely common source of bugs
> Comparing or combining a signed and an unsigned integer together in the same expression causes C++ to silently convert the signed value into an unsigned one behind the scenes, following a set of rules that can produce results wildly different from what you would naively expect, especially once a negative number gets involved. A negative number compared against an unsigned value can, surprisingly, evaluate as "greater than" it, because the negative value gets silently reinterpreted as an enormous positive number during that automatic conversion. This is a well known, genuinely tricky pitfall worth being deliberately cautious around.

## 📏 Type modifiers: short, long, and long long

Beyond signed and unsigned, integer types can also be modified with `short`, `long`, or `long long` to request a smaller or larger range, at the cost or benefit of memory usage.

```cpp
short smallNumber = 100;             // typically at least 2 bytes
long bigNumber = 100000L;              // typically at least 4 bytes, often 8 on modern 64 bit systems
long long veryBigNumber = 10000000000LL;  // typically at least 8 bytes, guaranteed to hold very large values
```

> [!tip] The L and LL suffixes on numeric literals
> Adding `L` or `LL` directly after a numeric literal, such as `10000000000LL`, tells the compiler to treat that specific literal value itself as a `long` or `long long` from the very start, which matters for very large numbers that would not actually fit inside a plain `int` literal at all, even temporarily, during the initial parsing of your source code.

## 🔡 Characters and strings

A `char` holds exactly one single character, internally represented as a small integer following a character encoding standard, most commonly ASCII for basic English text.

```cpp
char letter = 'A';
std::cout << (int)letter << std::endl;   // prints 65, the underlying ASCII numeric value of the letter 'A'
```

For actual text made up of multiple characters, C++ provides the `std::string` type from the standard library, covered more fully in [[C++ Arrays & Strings]].

```cpp
#include <string>
std::string name = "Amit";   // note the DOUBLE quotes for a string, versus single quotes for a single char
```

> [!note] C style strings versus std::string
> C++ inherited a more primitive way of representing text directly from C, using an array of individual `char` values ending in a special null terminator character. This is often called a "C style string," and you will still encounter it, particularly in older codebases or when interacting with C libraries directly. Modern C++ code, however, overwhelmingly prefers `std::string`, since it manages its own memory automatically, supports convenient operations like concatenation with a simple `+`, and avoids many of the classic pitfalls that plain C style strings are notorious for.

## 🎯 Type inference with auto

C++11 introduced the `auto` keyword, letting the compiler automatically determine a variable's type based on the value used to initialize it, rather than you spelling the type out explicitly yourself.

```cpp
auto age = 25;            // the compiler infers this is an int
auto price = 19.99;          // the compiler infers this is a double
auto name = std::string("Amit");   // the compiler infers this is a std::string
```

> [!tip] When auto genuinely helps versus when it can hurt readability
> `auto` is especially valuable when a type would otherwise be extremely long and unwieldy to write out by hand, such as many of the iterator types that come up when working with [[C++ STL Containers]]. Used excessively on genuinely simple types, however, such as writing `auto age = 25;` instead of the perfectly clear `int age = 25;`, it can occasionally make code slightly harder to read at a glance, since the reader now has to mentally infer the type themselves rather than seeing it stated directly. Most style guides recommend using it where it removes genuine, unhelpful verbosity, while staying with an explicit type where the type itself is short and the clarity is valuable.

## 🔄 Type casting: converting between types

```cpp
double price = 19.99;
int wholePrice = (int)price;        // C style cast, truncates to 19, simply discarding the decimal part entirely

int wholePrice2 = static_cast<int>(price);   // the modern, C++ style cast, functionally equivalent here
```

> [!warning] static_cast is generally preferred over the older C style cast
> The C style cast, `(int)price`, is inherited directly from C and works, but it is deliberately vague and can quietly perform several genuinely different, more dangerous kinds of conversion behind a single unified syntax, without clearly signaling which one is actually happening in a given spot. Modern C++ style casts, such as `static_cast`, `dynamic_cast`, and `const_cast`, are each restricted to one specific, clearly named kind of conversion, making the programmer's actual intent far more explicit and searchable, and making genuinely dangerous conversions noticeably harder to perform completely by accident.

### Implicit versus explicit conversion

```cpp
int wholeNumber = 5;
double decimalNumber = wholeNumber;    // IMPLICIT conversion, happens automatically, int safely widens into double

double price = 19.99;
int truncated = price;                    // ALSO implicit, but potentially lossy, the decimal part silently gets discarded
```

> [!note] Widening conversions are safe, narrowing conversions can silently lose data
> Converting from a smaller, less precise type into a larger, more precise one, such as an `int` into a `double`, is called "widening," and always happens safely with no genuine risk of losing information. Converting the other direction, from a larger or more precise type down into a smaller or less precise one, such as a `double` into an `int`, is called "narrowing," and can genuinely and silently lose information, here simply discarding the entire decimal portion of the number without any warning at all under the traditional assignment syntax.

## 🧮 Constants: values that cannot change

```cpp
const double PI = 3.14159;
PI = 3.14;   // this line would cause a COMPILE ERROR, since PI was declared as const
```

> [!tip] Prefer const by default, wherever a value genuinely never changes
> Marking a variable `const` whenever it genuinely never needs to change after being initialized is a strong, widely followed habit in modern C++, since it lets the compiler itself catch an accidental attempt to modify it later, and it also clearly communicates your actual intent to anyone else reading the code afterward, without needing an extra comment to explain it.

## 🔗 Where to go next

With the core types covered, continue to [[C++ Operators & Expressions]] to see how values of these types get combined and compared, or move to [[C++ Arrays & Strings]] to see how multiple values of the same type get grouped together.
