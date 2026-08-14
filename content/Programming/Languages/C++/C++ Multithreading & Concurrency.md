---
title: C++ Multithreading & Concurrency
tags: [cpp, programming, multithreading, concurrency, threads, mutex]
aliases: [C++ std::thread, C++ Mutex, C++ Concurrency]
status: evergreen
---

# C++ Multithreading & Concurrency

## 🧠 What this note covers

Multithreading lets a single program genuinely run several separate, independent sequences of instructions, called threads, at effectively the same time, taking real, direct advantage of a modern processor's multiple genuine cores. This note covers creating and managing threads with `std::thread`, protecting genuinely shared data with a mutex, and a few of the sharpest, most genuinely important pitfalls concurrent code specifically, uniquely introduces.

## 🧵 Creating a basic thread

```cpp
#include <thread>
#include <iostream>

void printMessage() {
    std::cout << "Hello from a genuinely separate thread" << std::endl;
}

int main() {
    std::thread t(printMessage);   // starts running printMessage CONCURRENTLY, on a separate thread
    t.join();                          // waits here, blocking, until that thread has genuinely, fully finished
    return 0;
}
```

> [!note] Why join() is genuinely necessary here
> Calling `.join()` blocks the calling thread, here `main`, until the specific other thread it is called on has genuinely, fully finished running. Without ever calling either `.join()` or `.detach()` on a `std::thread` object before it itself genuinely goes out of scope, the program will immediately, abruptly terminate outright, calling `std::terminate`, since C++ specifically, deliberately refuses to allow a thread object to simply, silently be destroyed while its own underlying thread might genuinely still be actively running.

```cpp
std::thread t(printMessage);
t.detach();   // lets the thread run entirely independently, genuinely on its own, without main ever waiting for it
```

> [!warning] Choosing between join and detach is a genuinely deliberate, important design decision
> Use `.join()` whenever your own main program genuinely needs to wait for a given thread's specific result, or simply needs a firm, reliable guarantee that the thread's own work has genuinely, fully finished before continuing further. Use `.detach()` specifically, deliberately for genuinely independent, background style work where the main program does not itself actually need to wait around for it at all, though detached threads do carry a genuine, real risk of still actively running even after `main` itself has already exited, which can, in some genuine cases, actively cause its own separate problems if not handled with real, deliberate care.

## 🔀 Passing arguments to a thread

```cpp
void greet(std::string name) {
    std::cout << "Hello, " << name << std::endl;
}

std::thread t(greet, "Amit");   // arguments are passed directly, right after the actual function itself
t.join();
```

> [!tip] Arguments are genuinely copied by default, exactly like an ordinary function call
> Just like an ordinary function call, covered originally in [[C++ Functions]], arguments passed to `std::thread` are copied by default, unless you specifically, deliberately wrap them with `std::ref()` to genuinely pass by reference instead. This default copying behavior is itself a genuinely deliberate, important safety measure, since it helps meaningfully avoid one thread accidentally, unexpectedly modifying data that another, genuinely separate thread might still be actively, concurrently relying on at that exact same moment.

## 🔒 Race conditions and the need for genuine synchronization

A race condition genuinely occurs when two or more threads access, and at least one of them actively modifies, the exact same shared piece of data at the exact same time, without any proper, deliberate coordination between them, producing results that become genuinely unpredictable and can meaningfully vary from one single run of the exact same program to the very next.

```cpp
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        counter++;   // NOT genuinely safe, this specific operation is NOT actually atomic at all
    }
}

int main() {
    std::thread t1(increment);
    std::thread t2(increment);
    t1.join();
    t2.join();
    std::cout << counter << std::endl;   // very likely NOT reliably, correctly 200000, due to the underlying race condition
    return 0;
}
```

> [!warning] Why counter++ is genuinely not a single, atomic operation at all
> Despite appearing to be one single, simple, indivisible operation directly in the source code itself, `counter++` actually genuinely involves several genuinely separate underlying steps: reading the current value, adding one to it, and then finally writing that new result back. If two entirely separate threads happen to genuinely interleave these individual steps together, both potentially reading the exact same original value before either one has actually written its own updated result back, one thread's own genuine update can end up being silently, entirely lost, resulting in a genuinely, measurably incorrect final total.

## 🔐 std::mutex: protecting genuinely shared data

A mutex, short for "mutual exclusion," ensures that only a single thread at a time can genuinely access a specific, particular piece of shared, protected data.

```cpp
#include <mutex>

std::mutex mtx;
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        mtx.lock();
        counter++;
        mtx.unlock();
    }
}
```

> [!warning] Manually calling lock and unlock yourself is genuinely risky
> If an exception happens to be thrown, or a thread genuinely returns early, somewhere between a manual `.lock()` call and its own corresponding `.unlock()` call, the mutex would remain permanently, indefinitely locked forever afterward, a serious, genuine problem called a "deadlock," where every other thread still waiting on that exact same mutex ends up genuinely, permanently stuck, waiting forever. This is precisely, exactly why `std::lock_guard`, covered directly next, is the far safer, and generally, genuinely preferred approach in modern, idiomatic C++ code.

```cpp
#include <mutex>

std::mutex mtx;
int counter = 0;

void increment() {
    for (int i = 0; i < 100000; i++) {
        std::lock_guard<std::mutex> lock(mtx);   // locks the mutex immediately, right here, upon construction
        counter++;
    }   // automatically, reliably UNLOCKS right here, the moment lock genuinely goes out of scope
}
```

> [!tip] std::lock_guard is yet another direct, genuine application of the exact same RAII pattern
> `std::lock_guard` ties the mutex's own lock directly to a genuine stack allocated object's own lifetime, following exactly, precisely the same RAII principle already covered throughout [[C++ Memory Management]], [[C++ Smart Pointers]], and [[C++ Constructors & Destructors]]. This guarantees the mutex is always, reliably released correctly the moment the enclosing scope itself genuinely ends, entirely automatically, regardless of whether that scope genuinely ended through an ordinary, normal return or through a thrown exception instead, exactly as already covered in [[C++ Exception Handling]].

## ⚛️ std::atomic: a simpler alternative for genuinely simple shared variables

For genuinely simple cases involving just a single, individual shared variable, `std::atomic` provides a simpler, often more genuinely efficient alternative to a full, separate mutex.

```cpp
#include <atomic>

std::atomic<int> counter(0);

void increment() {
    for (int i = 0; i < 100000; i++) {
        counter++;   // now genuinely, fully safe, since std::atomic guarantees this specific operation is atomic
    }
}
```

> [!note] When atomic genuinely is, and is not, the correct, appropriate tool to reach for
> `std::atomic` works genuinely well specifically for simple, individual operations on a single, particular variable, such as this straightforward increment example. For anything genuinely more involved, such as coordinating changes across several genuinely related variables together, or protecting a larger, more complex data structure as a coherent, single whole, a proper `std::mutex` paired directly with `std::lock_guard` remains the more appropriate, genuinely correct tool for the job instead.

## 🧮 A brief note on deadlocks

> [!warning] A deadlock occurs when threads are each genuinely waiting on one another, forever
> A deadlock genuinely occurs when two or more threads each end up permanently waiting on a resource that is itself only ever going to be released by one of the other threads also genuinely, currently stuck waiting, creating a complete, unbreakable cycle where absolutely no thread involved can ever actually, genuinely make any further progress at all. A classic, well known example genuinely involves two threads each needing to lock two separate, distinct mutexes, but each one happening to acquire them in a genuinely different, opposite order, with thread one locking mutex A first and then genuinely waiting on mutex B, while thread two simultaneously locks mutex B first and then genuinely, correspondingly waits on mutex A. A strong, simple, reliable general practice for meaningfully avoiding this specific problem is to always, consistently ensure that every single thread throughout your program genuinely acquires multiple locks in exactly, precisely the same fixed, consistent order, every single time.

## 🔗 Where to go next

Multithreading directly connects back to the exception handling concepts covered in [[C++ Exception Handling]], since exceptions genuinely thrown on one particular thread specifically require deliberate, careful handling of their own. This note closes out the folder's coverage of modern C++ features. Revisit the [[C++]] main note for the complete map of everything covered across this entire folder.
