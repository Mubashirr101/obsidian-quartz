---
title: C++ Templates
tags: [cpp, programming, templates, generic-programming]
aliases: [C++ Generics, Template Functions, Template Classes]
status: evergreen
---

# C++ Templates

## 🧠 What this note covers

Templates are C++'s core mechanism for generic programming, letting you write a single function or class that works correctly across many entirely different data types, without needing to write a genuinely separate, duplicated version by hand for every single type you actually want to support. This note covers function templates, class templates, and a brief look at how this exact same underlying mechanism powers the standard library containers covered fully in [[C++ STL Containers]].

## 🎯 Function templates

Without templates, supporting a simple function like finding the maximum of two values, for several genuinely different types, would require writing several nearly identical, separately overloaded functions, exactly as covered in [[C++ Functions]].

```cpp
int getMax(int a, int b) {
    return (a > b) ? a : b;
}

double getMax(double a, double b) {
    return (a > b) ? a : b;
}
```

A template lets you write this same logic exactly once, with the actual specific type left as a placeholder, to be filled in later.

```cpp
template <typename T>
T getMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << getMax(3, 7) << std::endl;         // T becomes int here
    std::cout << getMax(3.5, 2.1) << std::endl;        // T becomes double here
    std::cout << getMax<int>(3, 7) << std::endl;          // explicitly specifying T, rather than relying on inference
    return 0;
}
```

> [!note] How the compiler actually determines what T should be
> In most everyday cases, the compiler is able to automatically infer the correct, appropriate type for `T` directly from the actual arguments you pass in at each specific call site, entirely without you needing to specify it explicitly yourself at all. You can, however, always explicitly specify it yourself using angle brackets, such as `getMax<int>(3, 7)`, which becomes genuinely necessary in certain situations where the compiler cannot confidently, reliably infer the intended type entirely on its own.

> [!tip] What actually happens behind the scenes: template instantiation
> A template itself is not, strictly speaking, real, actual compiled code at all, it is genuinely more like a set of precise instructions describing exactly how to correctly generate real code, once a specific, concrete type is eventually provided. The very first time `getMax<int>` is genuinely used anywhere in your program, the compiler automatically generates a real, actual, fully concrete version of that function specifically for `int`, in a process called "template instantiation." If both `int` and `double` versions genuinely end up being used somewhere across your actual program, the compiler will separately, automatically generate both distinct, concrete versions, entirely on your behalf.

## 🏛️ Class templates

Templates apply just as naturally, and just as usefully, to entire classes, not merely to individual functions on their own.

```cpp
template <typename T>
class Box {
private:
    T contents;

public:
    Box(T value) : contents(value) {}

    T getContents() const {
        return contents;
    }
};

int main() {
    Box<int> intBox(42);
    Box<std::string> stringBox("Hello");

    std::cout << intBox.getContents() << std::endl;      // 42
    std::cout << stringBox.getContents() << std::endl;      // Hello
    return 0;
}
```

> [!note] Why the type must always be explicitly specified for a class template
> Unlike function templates, where the compiler can very often confidently infer the intended type directly from the actual function arguments you provide, a class template genuinely requires you to explicitly state the specific type you want, using angle brackets, such as `Box<int>`, at the exact moment you actually declare a new object of that type. This is precisely, exactly the same fundamental underlying syntax you have already been using constantly throughout this folder whenever declaring a `std::vector<int>` or `std::string`, both of which are themselves, under the hood, genuinely just ordinary class templates provided directly by the standard library.

## 🧮 Templates with multiple type parameters

A template can accept more than one single, independent type parameter at once, letting a single class or function work flexibly across several genuinely different, independent types simultaneously.

```cpp
template <typename K, typename V>
class Pair {
public:
    K key;
    V value;

    Pair(K k, V v) : key(k), value(v) {}
};

int main() {
    Pair<std::string, int> ageEntry("Amit", 25);
    std::cout << ageEntry.key << ": " << ageEntry.value << std::endl;   // "Amit: 25"
    return 0;
}
```

## 🔢 Non-type template parameters

Beyond genuinely accepting types themselves as parameters, a template can also accept an ordinary, plain value directly, most commonly a fixed size integer, known as a "non-type template parameter."

```cpp
template <typename T, int Size>
class FixedArray {
private:
    T data[Size];

public:
    int getSize() const {
        return Size;
    }
};

int main() {
    FixedArray<int, 10> arr;
    std::cout << arr.getSize() << std::endl;   // 10
    return 0;
}
```

> [!note] Why this needs to be a template parameter rather than an ordinary constructor argument
> Because `Size` here directly determines the fixed, actual size of the internal raw array `data`, and a raw array's size in C++ genuinely must be a value known at compile time rather than merely at runtime, `Size` needs to be supplied as a template parameter, fully resolved during compilation itself, rather than as an ordinary constructor argument, which would only ever actually be known much later, at runtime.

## 🎨 Template specialization

Sometimes you genuinely want a template to behave meaningfully, deliberately differently for one specific, particular type, rather than following the exact same single, general, generic implementation used for every other type. Template specialization lets you provide a distinct, separate implementation specifically for that one particular case.

```cpp
template <typename T>
class Printer {
public:
    void print(T value) {
        std::cout << value << std::endl;
    }
};

template <>
class Printer<bool> {
public:
    void print(bool value) {
        std::cout << (value ? "true" : "false") << std::endl;   // a genuinely more readable output, specifically for bool
    }
};
```

> [!tip] Specialization is used deliberately and relatively sparingly
> Full template specialization like this is a genuinely powerful tool, but is used comparatively sparingly in most everyday, ordinary code, since it does meaningfully add real additional complexity to a codebase. It becomes genuinely valuable specifically in situations, like the boolean printing example above, where a single, one-size-fits-all generic implementation would technically still compile and work correctly for a particular type, but would produce meaningfully worse, less ideal, or simply less intuitive results for that one specific case compared to a dedicated, hand tailored alternative.

## 🧾 Templates and the standard library

Nearly the entire standard library, including `std::vector`, `std::string`, and every container covered in [[C++ STL Containers]], is itself built directly and entirely on top of exactly this same template mechanism. This is precisely why you can freely create a `std::vector<int>`, a `std::vector<std::string>`, or even a `std::vector` of your own genuinely custom class type, all using exactly, identically the same single underlying container implementation underneath.

> [!note] Why this design represents such a genuinely powerful approach overall
> Templates let the standard library's authors write the actual core logic for something like a dynamically resizable array, `std::vector`, exactly one single time, while still having it work correctly, safely, and efficiently across a genuinely unlimited, open ended range of different possible element types, including entirely custom ones you yourself will go on to define much later. This is precisely the same fundamental "write it once, genuinely reuse it everywhere" principle you already relied on constantly when using `std::vector<int>` throughout [[C++ Arrays & Strings]], now finally revealed as being exactly the same underlying mechanism you can directly apply yourself, in your own code, going forward.

## 🔗 Where to go next

With templates covered, continue to [[C++ STL Containers]] to see the rich, extensive family of ready made, template based data structures the standard library already provides you with, or move to [[C++ STL Algorithms & Iterators]] to see how templates power a similarly rich, extensive set of ready made, genuinely reusable operations you can perform directly on that data.
