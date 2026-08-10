---
title: 🧩 R Functions
tags: [r, programming, functions, scope]
aliases: [R Custom Functions]
status: evergreen
---

# 🧩 R Functions

## 🧠 What this note covers

A function is a reusable, named block of code that takes some input, does something with it, and typically returns a result. Functions are how you avoid repeating yourself, and they are also how R itself is built internally, since even basic operators like `+` are technically functions under the hood. This note covers writing your own functions, understanding arguments and default values, and how R decides which variables a function can see, a concept called scope.

## 🛠️ Writing a basic function

You create a function using the `function()` keyword, listing the inputs it expects inside the parentheses, followed by a block of code in curly braces describing what it should do.

```r
add_numbers <- function(a, b) {
  result <- a + b
  return(result)
}

add_numbers(3, 5)   # 8
```

> [!note] return() is often optional
> R automatically returns the value of the very last expression evaluated inside a function, even without an explicit `return()` call. This means the function above could just as validly be written with the last line simply being `a + b` on its own, without wrapping it in `return()`. Many experienced R programmers rely on this implicit return for short functions, while still using explicit `return()` when they need to exit a function early, or when it makes the intent clearer to a reader.

```r
add_numbers <- function(a, b) {
  a + b   # this is automatically returned, no return() needed
}
```

## 🎛️ Default argument values

You can give a function default values for its arguments, which are used automatically whenever the caller does not supply that argument themselves.

```r
greet <- function(name, greeting = "Hello") {
  paste(greeting, name)
}

greet("Amit")                  # "Hello Amit", uses the default greeting
greet("Amit", "Namaste")        # "Namaste Amit", overrides the default
greet("Amit", greeting = "Hi")   # "Hi Amit", explicitly named, always clear
```

> [!tip] Naming arguments protects against ordering mistakes
> R lets you call a function by either matching argument positions in order, or by explicitly naming each argument, in any order you like. For functions with more than two or three arguments, explicitly naming them, as in `greet(name = "Amit", greeting = "Hi")`, makes the code far more readable and protects against accidentally swapping arguments of the same type.

## 📥 The ... (dots) argument

The three dots, referred to as "dot dot dot" or simply "dots," let a function accept any number of additional arguments that it does not need to explicitly name in advance. This is how functions like `c()` and `paste()` are able to accept a flexible, unlimited number of inputs.

```r
sum_all <- function(...) {
  values <- c(...)
  sum(values)
}

sum_all(1, 2, 3, 4, 5)   # 15, works no matter how many numbers you pass in
```

> [!note] Passing dots through to another function
> The dots are also frequently used to forward extra arguments straight into another function being called inside yours, without needing to list every single one of them by name. This pattern shows up constantly in more advanced R code, particularly when writing wrapper functions around plotting or modeling functions.

## 🔁 Multiple return values

R functions can technically only return a single object, but since a list can hold anything, wrapping multiple results inside a list is the standard way to effectively return several values at once.

```r
summarize_scores <- function(scores) {
  list(
    mean_score = mean(scores),
    max_score = max(scores),
    min_score = min(scores)
  )
}

result <- summarize_scores(c(88, 92, 79, 95))
result$mean_score   # 88.5
result$max_score     # 95
```

## 🌐 Scope: what a function can and cannot see

Scope refers to the rules that determine which variables a given piece of code is allowed to access. R generally follows a rule called lexical scoping, meaning a function can see variables that were defined in the environment where the function itself was written, but variables created inside a function do not leak out into the wider script once the function finishes running.

```r
x <- 10

my_function <- function() {
  x <- 99   # this creates a NEW, separate local x, only visible inside the function
  print(x)   # prints 99
}

my_function()
print(x)   # still prints 10, the outer x was never touched
```

> [!warning] The <<- operator can modify outer variables
> While regular `<-` inside a function only affects a local copy, the special "super assignment" operator `<<-` reaches outside the function and modifies a variable in an enclosing environment, or creates one there if it does not already exist. This is a powerful tool, but overusing it makes code much harder to reason about, since a function suddenly has hidden side effects beyond its own return value. Most style guides recommend avoiding it unless you have a very specific reason.

```r
x <- 10
modify_outer <- function() {
  x <<- 99   # this DOES change the outer x
}
modify_outer()
print(x)   # now prints 99
```

## ⚠️ Anonymous functions

Sometimes you need a small, throwaway function just for a single use, without bothering to give it a permanent name. These are called anonymous functions and are extremely common when paired with the tools in [[R Apply Family]].

```r
sapply(1:5, function(x) x^2)   # a full anonymous function, the traditional syntax

sapply(1:5, \(x) x^2)          # the shorthand syntax introduced in R 4.1 and later, using a backslash
```

> [!tip] The backslash shorthand is newer
> The `\(x)` shorthand for anonymous functions was only added in R version 4.1, released in 2021. If you are reading older R code, tutorials, or Stack Overflow answers, you will almost exclusively see the full `function(x)` syntax, so it is worth being comfortable reading both even if you prefer writing the shorter version.

## 📏 Argument matching order

R matches arguments to a function call using three passes, in this specific order: first by exact name, then by partial name matching, and finally by position for whatever is left over.

```r
my_func <- function(alpha, beta, gamma) {
  cat(alpha, beta, gamma)
}

my_func(gamma = 3, 1, 2)   # gamma is matched by name first (3), then alpha=1, beta=2 fill in by position
```

> [!note] Partial matching exists but is risky to rely on
> R will also match an argument if you only type part of its name, as long as that partial name is unambiguous, for example typing `al = 1` to match `alpha`. This can save typing, but it is generally considered fragile style, since adding a new argument to a function later, such as one starting with the same letters, could silently break code relying on partial matching elsewhere.

## 🔗 Where to go next

Functions are the building blocks of everything more advanced in R. Continue to [[R Apply Family]] to see how functions combine with vectorized thinking to replace many loops entirely, or explore [[R Error Handling & Debugging]] to learn how to make your functions more robust against bad input.
