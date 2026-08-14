---
title: C++ Memory Management
tags: [cpp, programming, memory, stack, heap, new, delete]
aliases: [C++ Stack vs Heap, new and delete]
status: evergreen
---

# C++ Memory Management

## 🧠 What this note covers

Unlike many modern languages that handle memory automatically behind the scenes through a garbage collector, C++ generally gives the programmer direct, explicit control over memory allocation, which is exactly where much of the language's raw performance advantage comes from, but also where a large share of its most notorious and consequential bugs originate. This note covers the fundamental distinction between the stack and the heap, and how to manually allocate and release memory using `new` and `delete`, directly building on the pointer concepts from [[C++ Pointers & References]].

## 📚 The stack: fast, automatic, and limited

The stack is a region of memory used automatically for ordinary local variables, function parameters, and the general bookkeeping needed to track function calls. Memory on the stack is managed entirely automatically, allocated the instant a variable comes into scope, and freed automatically the instant it goes back out of scope, such as when a function returns.

```cpp
void myFunction() {
    int x = 5;          // allocated on the stack automatically
    int y = 10;            // also allocated on the stack automatically
}   // both x and y are automatically freed here, the moment the function returns, with no action needed from you
```

> [!note] Why the stack is so fast
> Stack allocation and deallocation are both extremely fast operations, since the stack simply grows and shrinks in a strict, predictable, last in first out order, similar to a physical stack of plates. The computer never needs to search for available space, or track which specific piece of memory belongs to what, the way it genuinely does for the heap, covered next.

> [!warning] The stack has a limited, fixed size
> Because the stack's total size is fixed and relatively small, typically just a few megabytes, allocating an enormous local array, or recursing far too deeply without ever reaching a genuine base case as covered in [[C++ Functions]], can exhaust the entire available stack space, causing a crash known as a "stack overflow." This is exactly why very large amounts of data are instead typically allocated on the heap.

## 🗄️ The heap: flexible, manual, and effectively unlimited

The heap is a much larger region of memory, available for you to explicitly request space from at runtime, and that memory remains genuinely allocated and reserved until you explicitly release it yourself, regardless of whether the original variable that first allocated it has itself already gone out of scope.

```cpp
int* ptr = new int;      // explicitly allocates a single int's worth of space, ON THE HEAP
*ptr = 25;                   // sets the value at that heap allocated memory

delete ptr;                     // explicitly releases that memory back, once you are genuinely done using it
```

> [!warning] Every single new must be matched by exactly one delete
> Memory allocated on the heap using `new` does not get automatically cleaned up when it goes out of scope, unlike stack memory. It remains reserved indefinitely until you explicitly call `delete` on it yourself. Forgetting to do so is called a "memory leak," where memory that is no longer genuinely needed or even reachable anymore stays permanently reserved anyway, since nothing in the program ever released it, and a program leaking memory continuously over a long enough runtime can eventually exhaust all available system memory entirely.

### Allocating and deallocating arrays on the heap

```cpp
int* scores = new int[5];   // allocates an array of 5 ints on the heap

scores[0] = 88;
scores[1] = 92;

delete[] scores;               // note the [] here, REQUIRED specifically for releasing an array allocation
```

> [!warning] Using plain delete on an array allocated with new[] is undefined behavior
> When releasing memory that was originally allocated as an array using `new[]`, you must use the matching `delete[]` form, not a plain `delete`. Using the wrong, mismatched form produces undefined behavior, and while it may sometimes appear to work correctly purely by coincidence on some systems or compilers, it is never genuinely safe or correct, and can cause serious, sometimes very hard to diagnose problems on others.

## 🎯 Dangling pointers and double deletion

> [!warning] A dangling pointer points to memory that has already been freed
> Once you call `delete` on a pointer, the memory it was pointing at is released back to the system, but the pointer variable itself still holds that exact same old address, now referred to as a "dangling pointer." Continuing to dereference it afterward produces undefined behavior, since that memory might now be entirely unrelated to what it once held, potentially already reused by something else in the program.

```cpp
int* ptr = new int(25);
delete ptr;
// ptr is now dangling, still holding the old, now invalid address

std::cout << *ptr << std::endl;   // undefined behavior, genuinely unsafe to do

ptr = nullptr;   // a strong, protective habit, immediately setting a pointer to nullptr right after deleting it
```

> [!tip] Set a pointer to nullptr immediately after deleting it
> Explicitly setting a pointer to `nullptr` right after calling `delete` on it is a widely recommended, protective habit, since it means any accidental later attempt to dereference that same pointer will crash immediately and predictably against a clear null check, rather than silently reading or writing to genuinely invalid, already reclaimed memory, which is a far more dangerous and unpredictable failure to actually debug.

> [!warning] Calling delete twice on the same pointer is also undefined behavior
> Calling `delete` a second time on a pointer that has already been deleted once, sometimes called a "double free," is another genuinely serious, undefined behavior bug, and can corrupt the underlying memory management system's own internal bookkeeping, sometimes causing crashes that appear to happen at a seemingly unrelated, completely different point later in the program's execution, making the original root cause quite difficult to actually track down.

## 🧮 Stack versus heap, side by side

| Feature | Stack | Heap |
|---|---|---|
| Allocation speed | Very fast | Slower, involves more bookkeeping |
| Size limit | Small, fixed, typically a few MB | Large, limited mainly by total system memory |
| Lifetime | Automatic, tied to scope | Manual, lasts until explicitly deleted |
| Managed by | The compiler, entirely automatically | You, the programmer, explicitly |
| Typical use | Ordinary local variables | Large data, or data that must outlive its creating function |

## 🛡️ Why modern C++ leans heavily toward smart pointers instead

Given the genuine, serious risks of memory leaks, dangling pointers, and double deletion covered above, modern C++ code overwhelmingly favors an approach called RAII, short for "Resource Acquisition Is Initialization," where a resource's lifetime, such as heap allocated memory, gets tied directly to an object's own lifetime on the stack, letting the stack's automatic cleanup indirectly handle the heap allocation's cleanup as well, entirely without you ever needing to remember a manual `delete` call at all.

```cpp
#include <memory>

std::unique_ptr<int> ptr = std::make_unique<int>(25);
// no manual delete needed at all, the memory is automatically released
// the very instant ptr itself goes out of scope, following the exact same
// automatic rules that already apply to ordinary stack variables
```

> [!tip] Smart pointers are covered fully in their own dedicated note
> This RAII pattern, and the `std::unique_ptr` and `std::shared_ptr` types that implement it directly for heap memory specifically, are covered in full, dedicated depth in [[C++ Smart Pointers]]. Understanding raw `new` and `delete` first, as covered in this note, remains genuinely valuable, both for reading and maintaining a great deal of existing, older C++ code, and for building a proper, honest mental model of exactly what smart pointers are actually managing so safely and conveniently on your behalf underneath the surface.

## 🔗 Where to go next

Continue directly to [[C++ Smart Pointers]] for the strongly preferred, modern approach to nearly everything covered in this note. From here, [[C++ Classes & Objects]] and [[C++ Constructors & Destructors]] show how RAII extends naturally well beyond just memory, to managing any kind of resource, such as an open file or a network connection, using this exact same underlying pattern.
