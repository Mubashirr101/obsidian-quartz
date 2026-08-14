---
title: C++ Arrays & Strings
tags: [cpp, programming, arrays, strings, vectors]
aliases: [C++ Vector, std::string, C++ Array]
status: evergreen
---

# C++ Arrays & Strings

## 🧠 What this note covers

This note covers C++'s tools for working with collections of values: the fixed size built in array, the far more flexible and commonly used `std::vector`, and text handling through both old style C strings and the modern `std::string`. Building comfort here is essential before working with the broader collection of tools covered in [[C++ STL Containers]].

## 📦 Fixed size arrays

A C++ array holds a fixed number of elements, all of the exact same type, with that size decided once, at the moment the array is created, and unable to change afterward.

```cpp
int scores[5] = {88, 92, 79, 95, 61};

std::cout << scores[0] << std::endl;   // 88, the FIRST element, arrays are zero indexed
std::cout << scores[4] << std::endl;   // 61, the LAST element, at index 4, since there are 5 total elements
```

> [!warning] C++ does not check array bounds for you
> Unlike many modern languages, accessing an array index that is genuinely out of bounds, such as `scores[10]` on a 5 element array, does not reliably produce a clean, immediate error in C++. Instead, it produces undefined behavior, meaning the program might crash outright, might silently read completely unrelated, garbage memory, or might even appear to work correctly by pure accident, depending entirely on what happens to be sitting at that memory location at that specific moment. This lack of automatic bounds checking is a genuinely core and consequential characteristic of raw C++ arrays, and is a large part of the underlying motivation for preferring `std::vector`, covered further below, in most modern code.

## 📐 Multidimensional arrays

```cpp
int grid[3][4];   // a grid with 3 rows and 4 columns, 12 elements total

grid[0][0] = 1;
grid[1][2] = 5;

std::cout << grid[1][2] << std::endl;   // 5
```

## 🧺 std::vector: a dynamically resizable array

`std::vector`, provided by the standard library, behaves much like an array, but can grow and shrink freely at runtime, and additionally manages its own underlying memory automatically, entirely removing the manual memory management concerns covered in [[C++ Memory Management]].

```cpp
#include <vector>

std::vector<int> scores = {88, 92, 79};

scores.push_back(95);    // adds a new element onto the end, growing the vector automatically as needed
scores.pop_back();          // removes the very last element

std::cout << scores.size() << std::endl;   // reports the CURRENT number of elements
std::cout << scores[0] << std::endl;          // 88, accessed just like a regular array
std::cout << scores.at(0) << std::endl;         // 88, an alternative access method with actual bounds checking
```

> [!tip] Prefer .at() over [] whenever safety genuinely matters more than raw speed
> The `[]` operator on a `std::vector`, exactly like a plain array, performs no bounds checking at all, and produces undefined behavior on an invalid index. The `.at()` method instead performs an actual bounds check, and throws a proper, catchable exception, covered in [[C++ Exception Handling]], if the index turns out to genuinely be invalid. Since `.at()` does carry a small performance cost for that safety check, `[]` remains more common in tight, performance critical loops where the index is already provably guaranteed to be valid, while `.at()` is a genuinely safer default choice elsewhere.

> [!note] Why std::vector is generally preferred over a plain array in modern C++
> Beyond simply being resizable, `std::vector` also automatically manages its own underlying memory, safely allocating more space as needed and safely releasing everything when the vector itself goes out of scope, entirely avoiding the kind of manual memory leaks that a raw, dynamically sized array allocated with `new` and `delete`, covered in [[C++ Memory Management]], can so easily fall into if not handled with genuine care. For the vast majority of everyday, modern C++ code, `std::vector` is the correct, default first choice over a raw array.

### Iterating over a vector

```cpp
for (int score : scores) {
    std::cout << score << std::endl;
}

for (size_t i = 0; i < scores.size(); i++) {
    std::cout << "Index " << i << ": " << scores[i] << std::endl;
}
```

> [!tip] size_t is the conventional type for sizes and indices
> `scores.size()` returns a value of type `size_t`, an unsigned integer type specifically intended for representing sizes and counts. Using a plain `int` for a loop counter meant to compare against a `.size()` call can trigger the exact signed versus unsigned comparison pitfall already covered in [[C++ Data Types & Variables]], which is exactly why `size_t` is the more genuinely correct, idiomatic type to use for this specific purpose.

## 🔡 C style strings

C++ inherited a more primitive way of representing text directly from C, where a string is really just an array of individual `char` values, ending with a special null terminator character, written as `\0`, marking exactly where the actual text content ends.

```cpp
char greeting[] = "Hello";
// internally stored as: 'H' 'e' 'l' 'l' 'o' '\0'
```

> [!warning] C style strings are a genuinely common, historic source of security bugs
> Because a C style string relies entirely on that null terminator to correctly know where the text actually ends, functions operating on them can very easily read or write past the intended boundary if that terminator is somehow missing or gets miscalculated, leading to a notorious, historically very common category of bug called a buffer overflow, which has been directly responsible for a genuinely significant share of serious real world security vulnerabilities over the decades. Modern C++ code overwhelmingly prefers `std::string` instead, precisely because it manages this boundary safely and entirely automatically on your behalf.

## 📝 std::string: the modern way to handle text

```cpp
#include <string>

std::string name = "Amit";

name.length();          // returns the number of characters, here 4 (also available as name.size())
name + " Shaikh";          // concatenation, using a simple plus sign, produces "Amit Shaikh"
name.substr(0, 2);           // extracts a SUBSTRING, starting at index 0, taking 2 characters: "Am"
name.find("mit");              // searches for a substring, returns the STARTING INDEX of the first match, here 1
name[0];                          // accesses an individual character by index, here 'A'
```

> [!tip] std::string handles memory and resizing entirely for you
> Unlike a C style string, `std::string` automatically manages its own underlying memory, safely growing or shrinking as needed whenever you append, insert, or remove characters, without ever requiring you to think about buffer sizes or null terminators yourself at all. This directly mirrors the same benefit `std::vector` provides over a raw fixed size array, covered above.

### Common std::string operations

```cpp
std::string text = "Hello, world";

text.append("!");                  // appends onto the end, becomes "Hello, world!"
text.insert(5, ",  extra");           // inserts text at a specific index
text.erase(0, 7);                       // removes a range of characters, starting at index 0, removing 7 characters
text.replace(0, 5, "Goodbye");             // replaces a range of characters with new text

std::to_string(42);                          // converts a NUMBER into a std::string, "42"
std::stoi("42");                                // converts a std::string BACK into an int, the reverse direction
```

> [!note] Why converting between numbers and text needs explicit functions
> Unlike some more dynamically typed languages that will freely and automatically convert a number and a piece of text back and forth as needed, C++'s strict static typing means you must explicitly convert between a `std::string` and a numeric type yourself, using functions like `std::to_string()` to go from number to text, and `std::stoi()` (string to int), `std::stod()` (string to double), and similar functions to go the other direction.

## 🧾 Comparing arrays, vectors, and strings, side by side

| Feature | Array | std::vector | std::string |
|---|---|---|---|
| Fixed or resizable | Fixed size | Resizable | Resizable |
| Element type | Any single type | Any single type | Specifically characters |
| Bounds checking | None | None with `[]`, checked with `.at()` | None with `[]`, checked with `.at()` |
| Memory management | Manual, if dynamically allocated | Fully automatic | Fully automatic |

## 🔗 Where to go next

With collections and text handling covered, continue to [[C++ Pointers & References]] to understand exactly how these structures actually relate to memory underneath the surface, or move to [[C++ STL Containers]] to see the broader family of standard library data structures beyond just `std::vector`.
