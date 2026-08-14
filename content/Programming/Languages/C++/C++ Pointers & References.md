---
title: C++ Pointers & References
tags: [cpp, programming, pointers, references, memory]
aliases: [C++ Pointers, C++ References]
status: evergreen
---

# C++ Pointers & References

## 🧠 What this note covers

Pointers and references are two of the most distinctive, and often most intimidating, features of C++, both offering a way to work with data indirectly, through its memory address, rather than working with a value directly by name. This note builds the mental model for both, explains how they genuinely differ from one another, and sets up the foundation needed for [[C++ Memory Management]] and [[C++ Smart Pointers]].

## 📍 What a memory address actually is

Every single variable in a running program lives somewhere specific in the computer's memory, at a particular address, conceptually similar to a house number on a street. A pointer is simply a variable whose own value is one of these addresses, rather than holding an ordinary value like a number or a piece of text directly.

```cpp
int age = 25;
std::cout << &age << std::endl;   // prints age's memory ADDRESS, something like 0x7ffd3a2b1c

std::cout << age << std::endl;      // prints age's actual VALUE, 25
```

> [!note] The ampersand as the "address of" operator
> In this specific context, the ampersand symbol `&` placed directly in front of a variable name means "give me the memory address of this variable," referred to as the "address of" operator. This is a genuinely different meaning from the same symbol used inside a function parameter list, covered further below, where it instead declares a reference. C++ reuses several symbols for different purposes depending entirely on context, and this dual meaning of `&` is one of the more commonly confusing examples of that pattern for newcomers.

## 👉 Declaring and using a pointer

```cpp
int age = 25;
int* agePointer = &age;   // agePointer now HOLDS the address of age

std::cout << agePointer << std::endl;    // prints the address itself
std::cout << *agePointer << std::endl;      // "dereferences" the pointer, prints 25, the VALUE stored at that address

*agePointer = 30;    // modifies age INDIRECTLY, through the pointer
std::cout << age << std::endl;   // now prints 30
```

> [!note] The asterisk has two genuinely different meanings depending on context
> When the asterisk `*` appears in a variable's declaration, such as `int* agePointer`, it declares the variable as a pointer to that type. When the exact same asterisk symbol instead appears directly in front of an already existing pointer variable, such as `*agePointer`, it "dereferences" the pointer, meaning it accesses the actual value stored at the address the pointer is currently holding, rather than the address itself. This is the second major example, alongside `&`, of a single symbol carrying genuinely different meanings purely based on where and how it appears.

## ❗ Null pointers

A pointer that is not currently pointing at any genuinely valid memory location at all is called a null pointer, and modern C++ represents this specific state using the keyword `nullptr`.

```cpp
int* ptr = nullptr;

if (ptr == nullptr) {
    std::cout << "ptr is not pointing to anything valid" << std::endl;
}
```

> [!warning] Dereferencing a null pointer causes an immediate crash
> Attempting to dereference a null pointer, meaning trying to access `*ptr` while `ptr` is currently `nullptr`, is one of the single most common causes of a program crashing outright, since there is genuinely nothing valid at that address to actually read or write. It is a very strong and important habit to explicitly check whether a pointer is `nullptr` before ever dereferencing it, particularly whenever there is any real possibility it might not have been properly assigned a valid, meaningful address yet.

> [!note] nullptr versus the older NULL macro
> Older C and C++ code frequently uses `NULL` instead of `nullptr` for this exact same purpose. `nullptr`, introduced specifically in C++11, is the modern, genuinely type safe replacement, and is now the strongly recommended choice in new code, since `NULL` is really just a plain integer `0` in disguise underneath, which can occasionally cause genuine ambiguity in certain overload resolution situations covered in [[C++ Functions]], a problem `nullptr` was specifically designed to eliminate entirely.

## 🔗 References: an alias for an existing variable

A reference is, conceptually, an alternative name, or alias, directly for an already existing variable, rather than being a separate variable holding an address the way a pointer is.

```cpp
int age = 25;
int& ageRef = age;   // ageRef is now simply another name for the exact same variable as age

ageRef = 30;             // modifying ageRef ALSO modifies age directly, since they refer to the same thing
std::cout << age << std::endl;   // prints 30
```

> [!note] A reference must be initialized immediately, and can never later be reseated
> Unlike a pointer, which can be declared without initially pointing at anything at all, and can later be reassigned to point at a completely different variable entirely, a reference must be bound to a specific, genuine variable at the exact moment it is declared, and it can never afterward be made to refer to a different variable instead. Once created, a reference is permanently, unchangeably tied to whatever variable it was originally bound to.

## 🆚 Pointers versus references, side by side

| Feature | Pointer | Reference |
|---|---|---|
| Can be null | Yes, using `nullptr` | No, must always refer to something valid |
| Can be reassigned later | Yes, to point at something else entirely | No, permanently bound at creation |
| Needs dereferencing to access the value | Yes, using `*` | No, used exactly like the original variable |
| Can be left uninitialized | Yes, though genuinely risky | No, the compiler enforces immediate initialization |

> [!tip] When to reach for a reference versus a pointer
> As a general, widely followed rule of thumb in modern C++, prefer a reference whenever you know for certain, at compile time, that you will always genuinely have a valid, real thing to refer to, and you will never need to reassign it to something else afterward, such as most everyday function parameters, exactly as shown in [[C++ Functions]]. Reach for a pointer instead specifically when you genuinely need the explicit possibility of "nothing valid yet" (represented cleanly with `nullptr`), or when you genuinely need the ability to later reassign it to refer to something else entirely over its lifetime.

## 🧮 Pointers and arrays: a close, historic relationship

In C++, an array's name, on its own, actually decays into a pointer to its very first element in most contexts, which is exactly why pointer arithmetic works naturally and directly with arrays.

```cpp
int scores[3] = {10, 20, 30};
int* ptr = scores;   // scores itself decays into a pointer to its first element

std::cout << *ptr << std::endl;         // 10, the first element
std::cout << *(ptr + 1) << std::endl;      // 20, moving the pointer forward BY ONE ELEMENT (not one byte)
std::cout << ptr[1] << std::endl;             // 20, the [] syntax is actually just a convenient shorthand for *(ptr + 1)
```

> [!note] Why pointer arithmetic advances by whole elements, not raw bytes
> Adding `1` to a pointer does not simply move it forward by one single raw byte in memory, it moves it forward by exactly the size of one full element of whatever type the pointer is declared to point at. A pointer to an `int`, moved forward by `1`, actually advances by 4 bytes on a typical modern system, precisely because a single `int` itself typically occupies 4 bytes. This is exactly why `ptr[1]` and `*(ptr + 1)` are genuinely, fully equivalent, and this same underlying mechanism is what allows array indexing to work correctly and consistently at all, regardless of the specific type being stored.

## 🔗 Pointers to pointers

A pointer can itself point to another pointer, creating a "pointer to a pointer," which comes up in certain more advanced scenarios, such as when a function genuinely needs to modify a caller's own pointer variable directly, rather than merely the value it happens to be pointing at.

```cpp
int age = 25;
int* ptr = &age;
int** ptrToPtr = &ptr;   // ptrToPtr holds the ADDRESS of ptr itself

std::cout << **ptrToPtr << std::endl;   // dereferences TWICE, arriving finally at 25
```

> [!note] Where this genuinely comes up in practice
> Pointers to pointers show up less frequently in ordinary, everyday application level code, but they appear regularly in certain specific, well established patterns, such as a function designed to allocate memory and then hand back the resulting new pointer to its caller through an output parameter, or when working with genuinely dynamic, multi level arrays or matrices built directly out of raw pointers.

## 🔗 Where to go next

With this foundation, continue to [[C++ Memory Management]] to see how pointers connect to manually allocating and freeing memory on the heap, or move to [[C++ Smart Pointers]] for the strongly preferred modern approach that manages this same underlying complexity safely and largely automatically.
