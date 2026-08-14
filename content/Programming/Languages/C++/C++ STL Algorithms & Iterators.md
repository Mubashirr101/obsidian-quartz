---
title: C++ STL Algorithms & Iterators
tags: [cpp, programming, stl, algorithms, iterators]
aliases: [C++ Iterators, std::sort, std::find]
status: evergreen
---

# C++ STL Algorithms & Iterators

## 🧠 What this note covers

Iterators are the connective tissue that lets the standard library's algorithms, covered in this note, work correctly and consistently across every one of the genuinely different containers covered in [[C++ STL Containers]], using one single, shared, unified interface, entirely regardless of how each individual container actually happens to store its own data internally underneath. This note covers what iterators genuinely are, and walks through the most commonly used, everyday standard library algorithms built directly on top of them.

## 🧭 What an iterator actually is

An iterator is an object that behaves very similarly to a pointer, capable of referring to a specific element within a container, and of being moved forward, and in some cases backward, to visit other elements in sequence, one at a time.

```cpp
#include <vector>

std::vector<int> numbers = {10, 20, 30};

std::vector<int>::iterator it = numbers.begin();   // an iterator pointing at the FIRST element

std::cout << *it << std::endl;   // 10, dereferenced exactly like a genuine pointer
++it;                                 // advances the iterator forward, to the NEXT element
std::cout << *it << std::endl;   // 20
```

> [!note] begin() and end() define the genuine, valid range
> Every standard container provides a `.begin()` method, returning an iterator to its very first element, and an `.end()` method, returning a special iterator that specifically represents the position genuinely just past the very last element, rather than the last element itself. This `.end()` iterator is never actually meant to be dereferenced directly at all, it exists purely to serve as a clean, reliable stopping point, letting code correctly know precisely when it has genuinely finished, fully traversed the entire container.

```cpp
for (std::vector<int>::iterator it = numbers.begin(); it != numbers.end(); ++it) {
    std::cout << *it << std::endl;
}
```

> [!tip] The range based for loop is largely just a cleaner shorthand for this exact same pattern
> The range based for loop already covered in [[C++ Control Flow]], written as `for (int num : numbers)`, is, underneath the surface, essentially just a cleaner, more concise, automatically generated version of precisely this same explicit iterator based loop pattern shown directly above. Understanding the underlying, explicit iterator mechanism itself remains genuinely valuable, both for reading and correctly maintaining older, existing C++ code, and for the many standard algorithms covered below that genuinely still require iterators to be passed in explicitly, directly, by hand.

## 🔎 std::find: searching for a value

```cpp
#include <algorithm>
#include <vector>

std::vector<int> numbers = {10, 20, 30, 40};

auto it = std::find(numbers.begin(), numbers.end(), 30);

if (it != numbers.end()) {
    std::cout << "Found it at position: " << (it - numbers.begin()) << std::endl;   // 2
} else {
    std::cout << "Not found" << std::endl;
}
```

> [!note] Why std::find returns an iterator, not simply a plain boolean or an index
> Returning an iterator, rather than merely a simple true/false result, lets `std::find` remain fully, genuinely generic and usable across every different kind of standard container, including ones like `std::list` that genuinely do not support fast, direct, constant time index based access at all. It also conveniently lets you immediately, directly continue working further with the exact, actual element you just successfully found, right at that same specific position, without needing any separate, additional lookup step at all.

## 🔀 std::sort: sorting a range

```cpp
#include <algorithm>
#include <vector>

std::vector<int> numbers = {40, 10, 30, 20};

std::sort(numbers.begin(), numbers.end());
// numbers becomes {10, 20, 30, 40}

std::sort(numbers.begin(), numbers.end(), std::greater<int>());
// numbers becomes {40, 30, 20, 10}, sorted in DESCENDING order instead, using a custom comparator
```

> [!tip] Providing your own, entirely custom comparator function
> `std::sort` accepts an entirely optional third argument, a comparator, letting you define precisely, exactly what "should come first" genuinely means for your own particular, specific situation. This is especially useful when sorting a collection of your own custom class objects, where there generally is not any single, one obvious, universally correct default sorting order to reliably fall back on.

```cpp
struct Student {
    std::string name;
    int age;
};

std::vector<Student> students = {{"Amit", 25}, {"Sara", 22}, {"Wei", 30}};

std::sort(students.begin(), students.end(), [](const Student& a, const Student& b) {
    return a.age < b.age;   // sorts specifically by age, in ascending order
});
```

> [!note] This example uses a lambda expression, covered in a dedicated later note
> The `[](const Student& a, const Student& b) { return a.age < b.age; }` portion shown above is what is called a lambda expression, a genuinely convenient way to define a small, temporary, throwaway function directly inline, right at the exact spot it is actually needed. Lambda expressions are covered fully, in their own dedicated depth, in [[C++ Lambda Expressions & Move Semantics]].

## ➕ std::accumulate: summing (or otherwise combining) a range

```cpp
#include <numeric>
#include <vector>

std::vector<int> numbers = {10, 20, 30};

int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
std::cout << sum << std::endl;   // 60
```

> [!note] The third argument is the required, necessary starting value
> The `0` passed in as the third argument here is the genuine starting value the accumulation process itself begins from. This is required specifically because `std::accumulate` is actually a genuinely general purpose tool, and can be used for far more than simply straightforward addition, such as concatenating a whole range of strings together, or multiplying an entire range of numbers together instead, provided you correctly supply both an appropriate starting value and, if needed, an appropriate custom combining operation to actually use.

## 🎯 std::for_each: applying an operation to every single element

```cpp
#include <algorithm>
#include <vector>

std::vector<int> numbers = {1, 2, 3};

std::for_each(numbers.begin(), numbers.end(), [](int n) {
    std::cout << n * 2 << std::endl;
});
```

> [!tip] std::for_each versus a plain, ordinary range based for loop
> For genuinely simple cases, an ordinary range based `for` loop is very often just as clear, just as readable, and just as effective as reaching directly for `std::for_each`. `std::for_each` tends to become more genuinely useful specifically once you are already smoothly, directly chaining several other STL algorithms together in immediate sequence, or when you specifically need to conveniently pass the operation itself around as a genuine, first class, reusable value, such as a function or lambda, rather than merely as an inline loop body written directly in place.

## 🧮 A few more genuinely commonly used algorithms

```cpp
#include <algorithm>

std::vector<int> numbers = {5, 3, 8, 1, 9};

std::max_element(numbers.begin(), numbers.end());   // returns an iterator to the LARGEST element found
std::min_element(numbers.begin(), numbers.end());     // returns an iterator to the SMALLEST element found
std::reverse(numbers.begin(), numbers.end());           // reverses the entire range directly, IN PLACE
std::count(numbers.begin(), numbers.end(), 8);             // counts how many elements genuinely equal 8
std::all_of(numbers.begin(), numbers.end(), [](int n) { return n > 0; });   // true if EVERY element satisfies the given condition
std::any_of(numbers.begin(), numbers.end(), [](int n) { return n > 100; });   // true if AT LEAST ONE element satisfies it
```

> [!tip] Reaching for a standard algorithm instead of writing a manual, hand rolled loop
> A genuinely strong, widely followed habit in modern, idiomatic C++ is to actively prefer an appropriate existing standard algorithm over writing yet another manual, hand rolled loop yourself, wherever a suitable, fitting one genuinely already exists. Beyond simply saving you some typing, using a standard, well established algorithm also very clearly, immediately communicates your actual intent to any future reader, and these algorithms have themselves already been extremely thoroughly tested, and are very often further optimized by your specific compiler, in ways a quickly, casually hand written loop of your own genuinely might not be.

## 🔗 Where to go next

With algorithms and iterators covered, you now have the essential, complete toolkit for working effectively and idiomatically with the STL containers covered in [[C++ STL Containers]]. Continue to [[C++ Lambda Expressions & Move Semantics]] to see the modern lambda syntax used throughout this note explained in genuine, full depth, or move to [[C++ Exception Handling]] to see how to make code using these tools genuinely more robust against unexpected, unforeseen failure.
