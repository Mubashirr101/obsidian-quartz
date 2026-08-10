---
title: 🔤 R Basics & Syntax
tags: [r, programming, basics, syntax]
aliases: [R Syntax, R Fundamentals]
status: evergreen
---

# 🔤 R Basics & Syntax

## 🧠 What this note covers

This note walks through the smallest building blocks of R code: how to write comments, how to create variables, what operators are available, and a few conventions you will see everywhere once you start reading real R scripts. Think of this as the alphabet before you start forming sentences with [[R Functions]] and [[R Control Flow]].

## 💬 Comments

A comment is a line of text in your code that R completely ignores when it runs. Comments exist purely so that humans reading the code later, including a future version of yourself, can understand what is going on. In R, anything after a hash symbol on a line is treated as a comment.

```r
# This entire line is a comment and does nothing when run
x <- 5  # You can also add a comment after real code, on the same line
```

> [!tip] Comment the why, not the what
> A comment like `# add 1 to x` next to `x <- x + 1` does not tell you much that the code did not already say. A more useful comment explains why you are doing something, for example `# adjusting for zero indexed months` next to the same line.

## 📝 Assignment: putting values into names

In most languages you assign a value using a single equals sign, but R traditionally uses an arrow made of a less than sign and a hyphen, written as `<-`. This arrow visually points in the direction the value is flowing, from the value on the right into the name on the left.

```r
age <- 25          # the standard and most idiomatic way to assign in R
age = 25            # also works, but is less traditional in R style
30 -> age            # a right pointing arrow also works, though it is rare
```

> [!note] Why does R even allow three ways to assign
> R inherited `<-` from its predecessor language S. The single equals sign `=` was added later for people coming from other languages and is fully functional for assignment, but the R community still strongly favors `<-` in scripts, largely because `=` is also used for a different purpose, matching arguments by name inside a function call.

## 🔢 The core data types

Every value in R has a type. Understanding these early makes everything else in the language click into place much faster.

| Type | Example | Explanation |
|---|---|---|
| numeric (double) | `3.14` | Any real number, including whole numbers by default |
| integer | `5L` | A whole number, forced by adding an uppercase L after the digits |
| character | `"hello"` | Text, wrapped in either double or single quotes |
| logical | `TRUE`, `FALSE` | A boolean value, can also be shortened to T and F |
| complex | `2+3i` | A complex number, rarely used outside specialized math |

```r
class(3.14)      # returns "numeric"
class(5L)        # returns "integer"
class("hello")   # returns "character"
class(TRUE)      # returns "logical"
```

> [!warning] Numbers are doubles by default
> If you type `x <- 5` without the L, R stores it as a numeric double, not an integer, even though it looks like a whole number. This rarely causes problems in everyday use, but it matters if you are working with functions that specifically expect an integer type.

## ➕ Operators

### Arithmetic operators

```r
5 + 3    # addition, gives 8
5 - 3    # subtraction, gives 2
5 * 3    # multiplication, gives 15
5 / 3    # division, gives 1.666667
5 %% 3   # modulo, the remainder after division, gives 2
5 %/% 3  # integer division, gives 1
5 ^ 2    # exponentiation, gives 25
```

### Comparison operators

```r
5 > 3    # TRUE
5 < 3    # FALSE
5 == 3   # FALSE, note the double equals for comparison
5 != 3   # TRUE, meaning "not equal to"
5 >= 5   # TRUE
```

> [!warning] Do not confuse `=` and `==`
> A single equals sign assigns a value, while a double equals sign checks for equality. Writing `if (x = 5)` instead of `if (x == 5)` is one of the most common beginner mistakes, and R will usually throw an error to protect you from it inside a condition.

### Logical operators

```r
TRUE & FALSE   # element wise AND, useful when comparing vectors
TRUE | FALSE   # element wise OR
!TRUE          # NOT, flips TRUE to FALSE
TRUE && FALSE  # AND but only checks the first element, used in if statements
TRUE || FALSE  # OR but only checks the first element, used in if statements
```

> [!tip] Single symbol versus double symbol logical operators
> Use the single symbol versions (`&` and `|`) when you are comparing entire vectors element by element, and use the double symbol versions (`&&` and `||`) when you are writing a condition inside something like an `if` statement, where you only need one TRUE or FALSE answer at the end.

## 🏷️ Naming rules for variables

A variable name in R can contain letters, numbers, dots, and underscores, but it cannot start with a number, and it cannot start with an underscore. Names are case sensitive, meaning `age` and `Age` are treated as two completely different variables.

```r
my_score <- 90     # valid, uses an underscore
my.score <- 90      # valid, R allows dots in names, unlike most languages
2nd_score <- 90      # invalid, cannot start with a number
```

> [!note] Dots in variable names
> Seeing a dot inside a variable or function name, such as `data.frame`, often confuses people coming from other languages, since in most languages a dot means "access a property of an object." In R it is simply a legal character in a name, though modern style guides such as the tidyverse style guide recommend using underscores instead of dots for new code.

## 🧮 Special values

R has a handful of special values that represent missing, undefined, or impossible results.

```r
NA      # represents a missing value, "Not Available"
NULL    # represents the absence of a value entirely, an empty object
NaN     # "Not a Number", the result of an undefined mathematical operation like 0/0
Inf     # represents infinity, such as the result of 1/0
-Inf    # negative infinity
```

> [!tip] Checking for these special values
> Never compare directly to `NA` using `==`, since `NA == NA` actually returns `NA`, not `TRUE`. Instead use the dedicated functions built for this purpose: `is.na(x)`, `is.null(x)`, and `is.nan(x)`.

## 🖨️ Printing output

```r
print("Hello, world")   # explicitly prints a value
"Hello, world"           # at the top level of a script, R auto prints this too
cat("Hello,", "world")   # concatenates and prints without quotes, useful for clean output
```

> [!tip] print versus cat
> Use `print()` when you want to see a value exactly as R represents it internally, including quotation marks around text. Use `cat()` when you want a cleaner, more human readable line of output, especially when combining multiple pieces of text and numbers together.

## 🔗 Where to go next

Once these basics feel comfortable, move on to [[R Vectors & Data Types]] to see how single values combine into R's fundamental data structure, or jump to [[R Control Flow]] to start writing logic that makes decisions.
