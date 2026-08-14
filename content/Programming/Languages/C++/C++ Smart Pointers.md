---
title: C++ Smart Pointers
tags: [cpp, programming, smart-pointers, raii, unique_ptr, shared_ptr]
aliases: [unique_ptr, shared_ptr, weak_ptr]
status: evergreen
---

# C++ Smart Pointers

## 🧠 What this note covers

Smart pointers are objects introduced in C++11 that behave very much like the raw pointers covered in [[C++ Pointers & References]], but automatically manage the lifetime of the memory they point to, following the RAII principle introduced in [[C++ Memory Management]]. This note covers the three main smart pointer types the standard library provides, `unique_ptr`, `shared_ptr`, and `weak_ptr`, and when each one is the genuinely correct choice.

## 🎯 unique_ptr: exclusive, single ownership

`std::unique_ptr` represents exclusive ownership of a piece of heap allocated memory, meaning exactly one `unique_ptr` at a time is ever responsible for a given piece of memory, and that memory is automatically, reliably released the moment that specific `unique_ptr` itself goes out of scope.

```cpp
#include <memory>

std::unique_ptr<int> ptr = std::make_unique<int>(25);
std::cout << *ptr << std::endl;   // 25, dereferenced exactly like a raw pointer

// no manual delete needed anywhere at all, ever
// the memory is automatically freed the instant ptr goes out of scope
```

> [!tip] Always prefer std::make_unique over a raw new call
> `std::make_unique<int>(25)` is the strongly preferred, modern way to actually create a `unique_ptr`, rather than writing `std::unique_ptr<int> ptr(new int(25))` directly. Beyond being noticeably more concise, `make_unique` also offers a genuine safety benefit in certain more complex expressions involving multiple allocations, entirely avoiding a specific, subtle category of memory leak that can otherwise occur if an exception happens to be thrown at just the wrong, unlucky moment during construction.

### unique_ptr genuinely cannot be copied

```cpp
std::unique_ptr<int> ptr1 = std::make_unique<int>(25);
std::unique_ptr<int> ptr2 = ptr1;   // COMPILE ERROR, unique_ptr cannot be copied
```

> [!warning] Copying a unique_ptr is intentionally forbidden by the compiler
> Since a `unique_ptr` represents strictly exclusive ownership, allowing it to simply be copied would immediately create two separate owners both believing they alone are responsible for releasing the exact same memory, which would inevitably lead directly to the double deletion problem covered in [[C++ Memory Management]]. The compiler therefore deliberately, actively forbids copying a `unique_ptr` altogether, catching this entire class of mistake immediately at compile time rather than allowing it to become a genuine runtime bug.

### Transferring ownership with std::move

While a `unique_ptr` cannot be copied, ownership of the underlying memory it manages can still be explicitly transferred from one `unique_ptr` to another, using `std::move`.

```cpp
std::unique_ptr<int> ptr1 = std::make_unique<int>(25);
std::unique_ptr<int> ptr2 = std::move(ptr1);
// ownership has now been transferred entirely to ptr2
// ptr1 is left in a valid but genuinely empty state, now effectively equivalent to nullptr
```

> [!note] std::move does not actually move anything by itself
> Despite its name, `std::move` does not, by itself, physically move any data anywhere at all. It simply converts its argument into a special category that explicitly signals "this value's resources are available to be taken from," allowing the receiving `unique_ptr` to cleanly and safely take over ownership from the source. This concept connects directly to the broader idea of move semantics, covered fully in [[C++ Lambda Expressions & Move Semantics]].

## 🤝 shared_ptr: shared ownership with reference counting

`std::shared_ptr` allows multiple pointers to genuinely, legitimately share ownership of the exact same piece of memory at once, internally keeping a running count of exactly how many `shared_ptr` instances currently point at that memory, and only actually releasing the memory once that count finally drops all the way down to zero.

```cpp
#include <memory>

std::shared_ptr<int> ptr1 = std::make_shared<int>(25);
std::shared_ptr<int> ptr2 = ptr1;   // this is perfectly fine, both now legitimately share ownership together

std::cout << ptr1.use_count() << std::endl;   // 2, reflecting that TWO shared_ptr instances currently exist

ptr1.reset();   // ptr1 gives up its own share of ownership
std::cout << ptr2.use_count() << std::endl;   // 1, only ptr2 remains now

// the underlying memory is finally, actually released only once the LAST remaining shared_ptr also disappears
```

> [!tip] make_shared is preferred over a raw new call here too, for the same reasons
> Just as with `unique_ptr`, `std::make_shared<int>(25)` is the preferred, idiomatic way to create a `shared_ptr`, and it additionally offers a genuine performance advantage here specifically, since it can allocate the actual object together with its internal reference counting bookkeeping data in a single, combined memory allocation, rather than as two entirely separate ones.

> [!note] When shared_ptr is genuinely the right, correct choice
> Reach for `shared_ptr` specifically when a piece of data's ownership genuinely, legitimately needs to be shared across multiple different parts of a program at once, with no single one of them being clearly, uniquely "the" sole owner, such as a resource being referenced by several different independent objects that were each created and will each be destroyed at entirely different, unrelated times. For the majority of everyday, ordinary situations where ownership is genuinely clear and singular, `unique_ptr` remains the better, more efficient default choice, both because it carries less overhead and because it makes ownership intent explicitly, immediately clear to any reader.

## 🔗 weak_ptr: observing without owning

`std::weak_ptr` provides a way to refer to an object managed by a `shared_ptr`, without itself counting toward that object's reference count at all, and therefore without keeping the object alive purely on its own account.

```cpp
std::shared_ptr<int> shared = std::make_shared<int>(25);
std::weak_ptr<int> weak = shared;   // weak observes the object, but does NOT increase the reference count at all

if (auto locked = weak.lock()) {     // .lock() attempts to obtain a genuine, temporary shared_ptr, if still valid
    std::cout << *locked << std::endl;   // 25
} else {
    std::cout << "The object no longer exists" << std::endl;
}
```

> [!warning] Why weak_ptr exists at all: breaking reference cycles
> The single most common and important reason to reach for `weak_ptr` is to break what is called a "reference cycle," a situation where two objects each hold a `shared_ptr` directly to one another, meaning each one's reference count can genuinely never reach zero, since each is permanently keeping the other one alive, causing a real, persistent memory leak despite using smart pointers specifically intended to prevent exactly that. Deliberately using a `weak_ptr` for one specific direction of such a mutual relationship, rather than a full `shared_ptr` on both sides, breaks that cycle cleanly, allowing both objects to eventually be properly released once genuinely no longer needed elsewhere.

## 🧮 Comparing the three smart pointer types

| Type | Ownership model | Can be copied | Typical use case |
|---|---|---|---|
| `unique_ptr` | Exclusive, single owner | No, only moved | The default, safest choice for most situations |
| `shared_ptr` | Shared among multiple owners | Yes, freely | When ownership is genuinely, legitimately shared |
| `weak_ptr` | Observes without owning | Yes, freely | Breaking reference cycles, or checking if something still exists |

> [!tip] A genuinely simple, sound default rule to actually follow
> When you are honestly unsure which smart pointer to reach for, `unique_ptr` is nearly always the safer, more efficient, and clearer starting default. Only escalate to `shared_ptr` once you have a genuine, concrete, specific reason that ownership truly does need to be shared across multiple owners, and reach for `weak_ptr` specifically to solve a reference cycle problem once you have actually identified one occurring, rather than reaching for either more powerful tool purely out of a vague, general sense of caution.

## 🔗 Where to go next

Smart pointers are the modern foundation for safe, reliable resource management in C++, and connect directly to how objects manage their own resources internally, covered in [[C++ Constructors & Destructors]]. Continue to [[C++ Classes & Objects]] if you have not yet, to see the broader object oriented context these tools operate within.
