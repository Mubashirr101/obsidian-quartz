---
title: C++ Control Flow
tags: [cpp, programming, control-flow, loops, conditionals]
aliases: [C++ Loops, C++ If Else, C++ Switch]
status: evergreen
---

# C++ Control Flow

## 🧠 What this note covers

Control flow refers to the tools that let a program make decisions and repeat actions rather than simply running from top to bottom in one single straight line. This note covers if and else statements, the switch statement, and the three loop types C++ provides, building directly on the operators explained in [[C++ Operators & Expressions]].

## ❓ if, else if, and else

```cpp
int score = 85;

if (score >= 90) {
    std::cout << "Grade: A" << std::endl;
} else if (score >= 80) {
    std::cout << "Grade: B" << std::endl;
} else if (score >= 70) {
    std::cout << "Grade: C" << std::endl;
} else {
    std::cout << "Grade: F" << std::endl;
}
// prints "Grade: B"
```

> [!note] Curly braces are technically optional for a single statement
> If an `if` block contains only one single statement, the curly braces `{ }` are technically optional in C++. Nearly every style guide still strongly recommends always including them regardless, since it is far too easy to later add a second line inside what you believe is still the conditional block, without noticing that only the very first line was actually ever controlled by the `if` statement, a genuinely common and sometimes quite subtle source of bugs.

## 🔎 The switch statement

`switch` provides a cleaner alternative to a long chain of `else if` statements, specifically when comparing one single variable against several possible fixed values.

```cpp
int day = 3;

switch (day) {
    case 1:
        std::cout << "Monday" << std::endl;
        break;
    case 2:
        std::cout << "Tuesday" << std::endl;
        break;
    case 3:
        std::cout << "Wednesday" << std::endl;
        break;
    default:
        std::cout << "Some other day" << std::endl;
}
```

> [!warning] Forgetting break causes "fall through," a classic C++ pitfall
> Without a `break` statement at the end of each case, execution does not stop there, it simply continues running directly into the next case below it, a behavior called "fall through." This is genuinely one of the most common and notorious sources of bugs for people newer to C++, since forgetting even a single `break` silently executes code from a case you never intended to run at all. Some C++ code deliberately makes use of fall through as an intentional technique, typically clearly marked with a comment explaining the choice, but leaving it in by accident is a real and frequent mistake worth being deliberately careful about.

```cpp
switch (day) {
    case 6:
    case 7:
        std::cout << "Weekend" << std::endl;
        break;
    default:
        std::cout << "Weekday" << std::endl;
}
// an intentional use of fall through, treating both case 6 and case 7 identically
```

## 🔁 The for loop

```cpp
for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}
// prints 0, 1, 2, 3, 4, each on its own line
```

Breaking down the three semicolon separated parts inside a traditional `for` loop:
- `int i = 0` runs exactly once, right at the very start, initializing the loop counter.
- `i < 5` is checked before every single iteration; the loop continues only while this remains true.
- `i++` runs at the end of every single iteration, after the loop body has finished running for that pass.

> [!warning] C++ arrays and most containers are zero indexed
> This traditional `for` loop pattern deliberately starts counting from `0`, not `1`, reflecting the fact that arrays and most standard containers in C++, covered further in [[C++ Arrays & Strings]] and [[C++ STL Containers]], are themselves zero indexed, meaning the very first element sits at position `0`, not position `1`. This is a foundational convention worth internalizing early, since it affects loop boundaries constantly throughout C++ code.

### The range based for loop

C++11 introduced a simpler loop specifically for iterating directly over every element of a container, without needing to manually manage an index variable at all.

```cpp
std::vector<int> numbers = {10, 20, 30, 40};

for (int num : numbers) {
    std::cout << num << std::endl;
}

for (const auto& num : numbers) {
    std::cout << num << std::endl;
}
```

> [!tip] Why const auto& is often the preferred form
> Writing `for (const auto& num : numbers)` avoids actually copying each element as the loop runs, instead referring to it directly in place, which matters for performance once elements are larger or more expensive to copy than a simple `int`, such as a full `std::string` or a custom class object. The `const` additionally signals clearly that the loop has no intention of modifying the original container's contents at all. This exact pattern connects directly to the concept of references, covered fully in [[C++ Pointers & References]].

## 🔄 The while loop

```cpp
int count = 1;
while (count <= 5) {
    std::cout << count << std::endl;
    count++;
}
```

A `while` loop checks its condition before every single iteration, including the very first one, meaning it is entirely possible for its body to never run at all if the condition is already false right from the very start.

> [!warning] Watch out for infinite loops
> A `while` loop only ever stops once its condition genuinely becomes false. Forgetting to update the variable being checked inside the loop body, such as forgetting the `count++;` line above, causes the loop to run forever, hanging the entire program. Always double check that the condition being tested is truly guaranteed to eventually become false under normal execution.

## 🔂 The do-while loop

A `do-while` loop is closely related to a regular `while` loop, but checks its condition after each iteration instead of before, guaranteeing the body runs at least one time, no matter what the condition initially evaluates to.

```cpp
int count = 1;
do {
    std::cout << count << std::endl;
    count++;
} while (count <= 5);
```

> [!note] When a do-while loop is genuinely the better structural fit
> A `do-while` loop is the natural choice specifically when a task genuinely needs to happen at least once regardless of any condition, such as prompting a user for input and then validating it afterward, where you obviously need to actually ask at least once before you have anything at all to check against the condition.

## ⛔ break and continue

```cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;     // immediately exits the loop entirely, skipping everything remaining
    }
    std::cout << i << std::endl;
}
// prints 0, 1, 2, 3, 4, then stops

for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;   // skips just this one single iteration, moving straight to the next
    }
    std::cout << i << std::endl;
}
// prints only the odd numbers: 1, 3, 5, 7, 9
```

> [!tip] break exits the loop, continue skips just one pass
> A simple way to remember the difference is that `break` is like leaving a room entirely, while `continue` is like skipping ahead to the next item on a checklist without leaving the room at all. Both work identically across `for`, `while`, and `do-while` loops.

## 🔗 Where to go next

With decision making and repetition covered, continue to [[C++ Functions]] to start packaging this kind of logic into genuinely reusable, named blocks of code, or move to [[C++ Arrays & Strings]] to see loops applied directly to real collections of data.
