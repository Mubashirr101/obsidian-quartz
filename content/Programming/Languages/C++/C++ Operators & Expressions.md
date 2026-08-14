---
title: C++ Operators & Expressions
tags: [cpp, programming, operators, expressions]
aliases: [C++ Operators]
status: evergreen
---

# C++ Operators & Expressions

## 🧠 What this note covers

An operator is a symbol that performs an operation on one or more values, called operands, and combining operators and values together forms what is called an expression. This note covers the major categories of operators C++ provides, from basic arithmetic through to the more unusual ones like the ternary operator, laying groundwork used constantly throughout [[C++ Control Flow]] and beyond.

## ➕ Arithmetic operators

```cpp
int a = 10, b = 3;

a + b;    // addition, 13
a - b;    // subtraction, 7
a * b;    // multiplication, 30
a / b;    // division, 3 (integer division truncates any decimal remainder entirely)
a % b;    // modulo, 1 (the remainder left over after division)
```

> [!warning] Integer division silently truncates, it does not round
> Dividing two `int` values in C++ always produces another `int`, meaning any decimal portion of the true mathematical result is simply discarded entirely, not rounded to the nearest whole number. `7 / 2` evaluates to `3`, not `3.5` and not `4`. If you genuinely need a decimal result, at least one of the two operands needs to actually be a floating point type, such as writing `7.0 / 2` instead.

## 🔢 Increment and decrement operators

```cpp
int x = 5;

x++;   // "post-increment," increases x by 1, but the EXPRESSION itself evaluates to the ORIGINAL value first
++x;   // "pre-increment," increases x by 1, and the expression evaluates to the NEW, already updated value
```

```cpp
int x = 5;
int y = x++;   // y becomes 5 (the original value), and THEN x becomes 6
int z = ++x;    // x becomes 7 FIRST, and THEN z becomes 7 (the new value)
```

> [!note] Why the pre versus post distinction genuinely matters
> When `++` or `--` is used purely on its own line, such as `x++;` by itself, the distinction between pre and post increment makes no practical difference at all, since nothing is actually reading the expression's resulting value in either case. The difference only becomes meaningful when the increment is embedded directly inside a larger expression, such as assigning the result to another variable, or as part of the classic `for` loop pattern covered in [[C++ Control Flow]].

## 🔍 Comparison operators

```cpp
int a = 5, b = 10;

a == b;   // equal to, false
a != b;   // not equal to, true
a < b;    // less than, true
a > b;    // greater than, false
a <= b;   // less than or equal to, true
a >= b;   // greater than or equal to, false
```

> [!warning] Do not confuse = and ==
> A single equals sign `=` performs assignment, while a double equals sign `==` checks for equality. Writing `if (a = 5)` instead of `if (a == 5)` is a classic, genuinely dangerous C++ mistake, since `a = 5` is itself a valid expression that assigns 5 to `a` and then evaluates to that assigned value, which is truthy, silently making the condition always true rather than producing a compile error the way you might hope for. Some compilers will warn about this specific pattern, but it remains a very real and well known pitfall to stay deliberately alert for.

## 🔗 Logical operators

```cpp
bool a = true, b = false;

a && b;   // logical AND, true only if BOTH operands are true, here false
a || b;   // logical OR, true if AT LEAST ONE operand is true, here true
!a;         // logical NOT, flips true to false and vice versa, here false
```

> [!tip] Short circuit evaluation can be used deliberately
> Both `&&` and `||` use what is called "short circuit evaluation," meaning the second operand is not even evaluated at all if the overall result can already be determined purely from the first one alone. For `&&`, if the first operand is already false, the whole expression is guaranteed false regardless of the second, so it is skipped entirely. This is frequently used deliberately, for instance writing `if (pointer != nullptr && pointer->value > 0)`, safely relying on the fact that the second check, which would otherwise crash on a null pointer, only ever runs once the first check has already confirmed the pointer is genuinely safe to use.

## 📝 Assignment operators

```cpp
int x = 10;

x += 5;    // equivalent to x = x + 5, x becomes 15
x -= 3;    // equivalent to x = x - 3
x *= 2;    // equivalent to x = x * 2
x /= 4;    // equivalent to x = x / 4
x %= 3;    // equivalent to x = x % 3
```

> [!tip] Compound assignment is more than just a shorter way to type things
> Beyond simply saving a bit of typing, compound assignment operators like `+=` genuinely communicate intent more clearly to a reader, immediately signaling "this variable is being updated relative to its own current value," rather than the reader needing to separately notice that the exact same variable name happens to appear on both sides of a plain `=` assignment.

## ❓ The ternary conditional operator

The ternary operator is C++'s only operator that takes exactly three operands, and provides a compact, single expression alternative to a simple if/else statement.

```cpp
int age = 20;
std::string category = (age >= 18) ? "adult" : "minor";
// reads as: if age >= 18, category becomes "adult", otherwise it becomes "minor"
```

> [!tip] When the ternary operator genuinely improves readability
> The ternary operator tends to genuinely improve readability specifically when choosing between two simple values to directly assign to a variable, exactly as shown above. Once the logic on either side grows more complex than a short, single expression, or once you find yourself nesting one ternary operator inside another, an ordinary `if`/`else` statement, covered in [[C++ Control Flow]], is almost always the clearer, more maintainable choice instead.

## 🧮 Bitwise operators

Bitwise operators work directly on the individual binary bits making up a value, rather than on its overall numeric meaning, and are most commonly seen in lower level, performance sensitive, or hardware adjacent code.

```cpp
int a = 5;    // binary: 0101
int b = 3;    // binary: 0011

a & b;    // bitwise AND, 0001, decimal 1
a | b;    // bitwise OR, 0111, decimal 7
a ^ b;    // bitwise XOR, 0110, decimal 6
~a;         // bitwise NOT, flips every single bit
a << 1;      // left shift, shifts every bit one position left, equivalent to multiplying by 2, here 10
a >> 1;        // right shift, shifts every bit one position right, equivalent to dividing by 2, here 2
```

> [!warning] Do not confuse bitwise operators with their logical counterparts
> `&` and `|` are bitwise operators, operating on individual bits, while `&&` and `||` are logical operators, operating on the overall true or false meaning of an entire expression. Using a single `&` where you actually meant the logical `&&` is a genuinely common and sometimes very confusing mistake, since both often happen to compile without error, but can silently produce a completely different, unintended result.

## 🎯 Operator precedence and associativity

Just like in ordinary mathematics, C++ operators follow a defined order of precedence, determining which operations get evaluated first within a single, more complex expression.

```cpp
int result = 5 + 3 * 2;    // 11, not 16, since multiplication has higher precedence than addition
int result2 = (5 + 3) * 2;   // 16, explicit parentheses override the default precedence entirely
```

> [!tip] When genuinely unsure of precedence, just add parentheses
> While C++ has a fully well defined, precise set of precedence rules for every single operator, memorizing every single one of them perfectly is rarely worth the mental effort in everyday practice. Adding explicit parentheses around a sub-expression whenever you are even slightly unsure of the resulting order of operations costs essentially nothing at compile time, and makes the code's actual intended meaning immediately, unambiguously clear to any future reader, including yourself.

## 🔗 Where to go next

With operators covered, continue to [[C++ Control Flow]] to see how comparison and logical operators drive actual decision making in a program, or move to [[C++ Functions]] to start packaging expressions like these into genuinely reusable pieces of code.
