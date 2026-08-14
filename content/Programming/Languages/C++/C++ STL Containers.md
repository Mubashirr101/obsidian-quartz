---
title: C++ STL Containers
tags: [cpp, programming, stl, containers, vector, map, set]
aliases: [C++ Standard Library Containers, std::map, std::set]
status: evergreen
---

# C++ STL Containers

## 🧠 What this note covers

The Standard Template Library, universally shortened to STL, is a large, foundational part of C++'s standard library, providing a rich set of ready made, thoroughly tested, genuinely reusable data structures, called containers, along with the algorithms and iterators, covered in [[C++ STL Algorithms & Iterators]], that operate directly on them. This note covers the most commonly used containers beyond `std::vector`, already introduced in [[C++ Arrays & Strings]], and when each one is genuinely the correct, appropriate choice.

## 🧺 std::vector: a quick recap

Already introduced in [[C++ Arrays & Strings]], `std::vector` is a dynamically resizable array, and is genuinely, overwhelmingly the correct default choice for most everyday, ordinary sequential data, offering fast, direct access to any element by its numeric index, and efficient, cheap addition of new elements specifically onto its end.

## 🔗 std::list: a doubly linked list

`std::list` stores its elements as a genuine doubly linked list, meaning each individual element directly holds a pointer forward to the next element and a pointer backward to the previous one, rather than being stored contiguously, sequentially in memory the way a `vector`'s elements genuinely are.

```cpp
#include <list>

std::list<int> numbers = {1, 2, 3};
numbers.push_front(0);   // efficient insertion directly at the FRONT, something a vector genuinely struggles with
numbers.push_back(4);       // efficient insertion at the back, just like a vector
```

> [!tip] When a list is genuinely preferable over a vector
> A `std::list` offers genuinely fast, constant time insertion and removal at any arbitrary position at all, once you already have a valid iterator pointing directly there, whereas a `vector` must actually shift every single subsequent element over by one position whenever inserting or removing anywhere other than right at its very end. In exchange, a `list` does not support fast, direct, constant time access by numeric index the way a `vector` does, and it generally carries meaningfully more memory overhead per individual element, due to needing to separately store those forward and backward pointers alongside the actual data itself. For the majority of ordinary, everyday use cases, `vector` remains the genuinely better default, with `list` reserved specifically for situations involving genuinely frequent insertion and removal happening squarely in the middle of a sequence.

## 🗺️ std::map: an ordered key-value store

`std::map` stores data as key-value pairs, automatically keeping them continuously sorted by key, and provides efficient lookup, insertion, and removal, all based directly on a given key.

```cpp
#include <map>

std::map<std::string, int> ages;
ages["Amit"] = 25;
ages["Sara"] = 30;

std::cout << ages["Amit"] << std::endl;   // 25

for (const auto& pair : ages) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}
// prints entries in sorted order BY KEY: "Amit: 25" then "Sara: 30"
```

> [!note] How std::map maintains its own sorted order internally
> Internally, `std::map` is typically implemented as a self balancing binary search tree, which is precisely what guarantees both that its elements always remain continuously sorted by key, and that lookup, insertion, and removal all remain reliably efficient, running in logarithmic time relative to the map's overall total size, rather than needing to scan through every single element individually.

> [!warning] Accessing a key with [] that does not already exist silently creates it
> Using `ages["NewKey"]` to merely check whether a particular key exists, without genuinely intending to actually add it, will silently, automatically insert a brand new entry for that key with a default constructed value, purely as a genuine side effect of that single access attempt, even if you never explicitly intended to add anything at all. If you only genuinely want to safely check whether a key already exists, without risking this exact unintended side effect, use `.find()` or `.count()` instead.

```cpp
if (ages.find("Amit") != ages.end()) {
    std::cout << "Amit is genuinely in the map" << std::endl;
}

if (ages.count("Amit") > 0) {
    std::cout << "Amit is genuinely in the map" << std::endl;
}
```

## ⚡ std::unordered_map: a hash based key-value store

`std::unordered_map` stores the exact same kind of key-value pairs as `std::map`, but internally uses a hash table instead of a sorted tree, trading away the guaranteed sorted ordering in direct exchange for genuinely, typically faster average lookup performance.

```cpp
#include <unordered_map>

std::unordered_map<std::string, int> ages;
ages["Amit"] = 25;
ages["Sara"] = 30;
// iteration order here is NOT guaranteed to follow any particular, predictable, meaningful sequence at all
```

> [!tip] Choosing between std::map and std::unordered_map
> Reach for `std::unordered_map` whenever you genuinely do not care about the iteration order of your entries at all, and simply want the fastest possible average lookup performance, which is the correct, right choice for the clear majority of everyday, ordinary use cases. Reach for `std::map` specifically instead when you genuinely do need your entries to remain continuously, automatically sorted by key, for instance if you need to reliably, correctly iterate through them in a predictable, meaningful, sorted order, or if you need efficient, direct access to a genuine range of keys at once, such as "every single key between X and Y."

## 🎯 std::set and std::unordered_set

A `set` stores a genuinely unique collection of values, automatically, entirely rejecting any duplicate entries, and shares that exact same sorted versus hash based distinction already covered above for maps.

```cpp
#include <set>

std::set<int> uniqueNumbers = {5, 3, 5, 1, 3};
// automatically, silently becomes just {1, 3, 5}, with duplicates removed AND kept fully sorted

uniqueNumbers.insert(4);       // adds 4
uniqueNumbers.erase(3);           // removes 3

if (uniqueNumbers.count(5) > 0) {
    std::cout << "5 is genuinely present" << std::endl;
}
```

> [!note] A set as essentially "a map with only keys, and genuinely no separate values"
> Conceptually, `std::set` can be reasonably understood as a `std::map` that only actually stores the keys themselves, with no separate associated value attached to each entry at all, and this exact same relationship applies equally between `std::unordered_set` and `std::unordered_map`. This is precisely why a `set`'s core underlying operations, insertion, removal, and existence checking, share such closely, directly matching performance characteristics with their corresponding map equivalents.

## 📚 std::stack and std::queue

`std::stack` and `std::queue` are what are formally called "container adapters," meaning they do not actually implement their own genuinely new, independent underlying storage mechanism at all, but instead restrict and adapt the interface of an already existing container, such as a `vector` or `list`, to enforce one single, specific, deliberate access pattern.

```cpp
#include <stack>
#include <queue>

std::stack<int> s;
s.push(1);
s.push(2);
s.push(3);
s.pop();               // removes 3, the most RECENTLY added element, LIFO: Last In, First Out
std::cout << s.top() << std::endl;   // 2, the new current top

std::queue<int> q;
q.push(1);
q.push(2);
q.push(3);
q.pop();               // removes 1, the LEAST recently added element, FIFO: First In, First Out
std::cout << q.front() << std::endl;   // 2, the new front
```

> [!tip] Choosing between a stack and a queue based purely on the required access pattern
> A `stack` follows a "Last In, First Out" (LIFO) access pattern, exactly like a genuine physical stack of plates, where you can only ever conveniently add or remove from the very top. A `queue` follows a "First In, First Out" (FIFO) access pattern instead, exactly like a genuine physical line of people waiting, where whoever joined first is also correctly, fairly the very first one to leave. Choosing between the two comes down entirely to which specific, deliberate access pattern your particular problem itself genuinely, actually requires.

## 🧮 A quick comparison table

| Container | Ordering | Duplicate keys/values allowed | Typical use case |
|---|---|---|---|
| `vector` | Insertion order | Yes | General purpose sequential data, the default choice |
| `list` | Insertion order | Yes | Frequent insertion or removal in the middle |
| `map` | Sorted by key | No (keys), values yes | Key-value data that needs to stay sorted |
| `unordered_map` | Unspecified | No (keys), values yes | Key-value data, fastest average lookup |
| `set` | Sorted | No | A unique, sorted collection of values |
| `unordered_set` | Unspecified | No | A unique collection, fastest average lookup |
| `stack` | LIFO access only | Yes | Undo history, expression parsing, recursion-like patterns |
| `queue` | FIFO access only | Yes | Task scheduling, processing items in arrival order |

## 🔗 Where to go next

With the major containers covered, continue to [[C++ STL Algorithms & Iterators]] to see the standard library's rich, ready made set of operations that work directly across nearly all of these same containers, using one single, genuinely shared, consistent, unified interface.
