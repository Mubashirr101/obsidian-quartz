---
title: 📊 R Vectors & Data Types
tags: [r, programming, vectors, data-types]
aliases: [R Vectors]
status: evergreen
---

# 📊 R Vectors & Data Types

## 🧠 What this note covers

The vector is the single most important data structure in R. Almost everything you will ever do in R, from simple math to building a full statistical model, is built on top of vectors. This note explains what a vector actually is, how to create one, how to select pieces out of it, and how R's vectorized thinking changes the way you write code compared to languages that rely on explicit loops.

## 📦 What is a vector

A vector is simply an ordered collection of values that all share the same data type. Even a single number like `5` is technically a vector of length one in R. This is different from many other languages, where a single number and a list of numbers are treated as fundamentally different kinds of things.

```r
x <- 5          # this is actually a numeric vector of length 1
class(x)        # "numeric"
length(x)       # 1
```

## 🛠️ Creating vectors with c()

The `c()` function, short for "combine," is how you build a vector out of multiple values.

```r
ages <- c(25, 30, 35, 40)              # a numeric vector
names <- c("Amit", "Sara", "Wei")       # a character vector
flags <- c(TRUE, FALSE, TRUE)           # a logical vector
```

> [!warning] Vectors are single typed
> All elements inside one vector must share the same type. If you try to mix types, R will silently convert everything to the most flexible type available, a process called coercion, rather than throwing an error.

```r
mixed <- c(1, "two", TRUE)
print(mixed)
# All three values get coerced into characters: "1" "two" "TRUE"
```

The coercion order, from least flexible to most flexible, generally goes: logical, then integer, then numeric (double), then character. R always coerces toward the more flexible type so that no information is lost.

## 🔢 Generating sequences

Two very common tools for building numeric vectors quickly are the colon operator and the `seq()` function.

```r
1:10           # creates 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
10:1           # counts down instead: 10, 9, 8, ... 1
seq(1, 10, by = 2)     # 1, 3, 5, 7, 9, specifying a custom step size
seq(0, 1, length.out = 5)  # 0, 0.25, 0.5, 0.75, 1, specifying how many total values you want
rep(3, times = 4)      # 3, 3, 3, 3, repeats a value a set number of times
rep(c(1, 2), each = 3) # 1, 1, 1, 2, 2, 2, repeats each element before moving to the next
```

> [!tip] seq versus the colon operator
> Use the simple colon operator `1:10` when you just need whole number steps of one. Reach for `seq()` when you need a custom step size, a specific number of evenly spaced points, or when you want your intent to be extremely clear to someone reading the code later.

## 🎯 Indexing: selecting elements from a vector

R uses square brackets `[ ]` to pull specific elements out of a vector, and one of the first surprises for newcomers is that R counts starting from 1, not from 0.

```r
scores <- c(88, 92, 79, 95, 61)

scores[1]        # 88, the first element (1 indexed, not 0 indexed)
scores[c(1, 3)]  # 88 and 79, selecting multiple positions at once
scores[-1]       # everything except the first element: 92 79 95 61
scores[2:4]      # a range of positions: 92 79 95
```

You can also index using a logical vector, which is one of the most powerful ideas in R, since it lets you filter data based on a condition in a single readable line.

```r
scores[scores > 80]   # returns only the values greater than 80: 88 92 95
scores > 80             # this alone produces a logical vector: TRUE TRUE FALSE TRUE FALSE
```

> [!note] Why negative indexing means "exclude"
> In many languages a negative index counts backward from the end of a list. In R, a negative index instead means "give me everything except this position." This is a common point of confusion for people coming from Python, where `scores[-1]` would mean "the last element," but in R it means "everything except the first element."

## 🏷️ Naming vector elements

Elements inside a vector can have names attached to them, which allows you to select values by name instead of by position.

```r
prices <- c(apple = 50, banana = 20, mango = 80)
prices["banana"]     # 20, selected by its name instead of its position
names(prices)         # "apple" "banana" "mango", returns just the names
```

## 🧮 Vectorized operations

This is the concept that makes R feel different from most general purpose languages. When you apply a mathematical operation to a vector, R applies it to every element automatically, without you writing a loop yourself.

```r
temps_celsius <- c(0, 10, 20, 30)
temps_fahrenheit <- temps_celsius * 9/5 + 32
print(temps_fahrenheit)
# 32 50 68 86, the formula was applied to every single element automatically
```

> [!tip] Vectorization is usually faster than a loop
> Beyond just being shorter to write, vectorized code in R is also typically much faster than the equivalent explicit loop, because the looping happens internally in fast, compiled C code rather than in slower, interpreted R code. As a rule of thumb, if you find yourself writing a `for` loop just to apply the same operation to every element of a vector one at a time, pause and ask whether a vectorized approach would work instead.

### Recycling

When you perform an operation between two vectors of different lengths, R will "recycle," or repeat, the shorter vector to match the length of the longer one.

```r
c(1, 2, 3, 4) + c(10, 20)
# becomes c(1, 2, 3, 4) + c(10, 20, 10, 20)
# result: 11 22 13 24
```

> [!warning] Silent recycling can hide bugs
> If the shorter vector's length does not divide evenly into the longer vector's length, R will still recycle it but will issue a warning. It is worth paying attention to these warnings, since unintentional recycling is a common and hard to spot source of bugs, especially when combining vectors of unexpected lengths.

## 🧾 Type checking and conversion functions

```r
is.numeric(x)     # checks whether x is numeric
is.character(x)   # checks whether x is character
is.logical(x)     # checks whether x is logical

as.numeric("5")     # converts the text "5" into the number 5
as.character(5)     # converts the number 5 into the text "5"
as.logical("TRUE")  # converts the text "TRUE" into the logical value TRUE
```

> [!tip] Failed conversions become NA, not errors
> If you try to convert something that cannot logically become the target type, such as `as.numeric("hello")`, R does not stop with an error. Instead it returns `NA` and prints a warning message. This is worth watching for when cleaning messy real world data, since a silent `NA` can slip through unnoticed if you are not checking for it.

## 🔗 Where to go next

Vectors are the foundation, but real data is rarely one flat list of values. Move on to [[R Data Structures]] to see how vectors combine into lists, matrices, and arrays, or jump straight to [[R Data Frames]] to see the structure you will use for almost all real world tabular data.
