---
title: 🔁 R Apply Family
tags: [r, programming, apply, vectorization, functional-programming]
aliases: [sapply, lapply, vapply, mapply, tapply]
status: evergreen
---

# 🔁 R Apply Family

## 🧠 What this note covers

The apply family is a set of functions that let you apply another function to every element of a vector, list, matrix, or grouped data, all in a single line, instead of writing an explicit `for` loop as covered in [[R Control Flow]]. These functions embody R's vectorized philosophy discussed in [[R Vectors & Data Types]], and getting comfortable with them is one of the biggest steps toward writing idiomatic, "R-native" code.

## 🤔 Why not just use a for loop

A `for` loop is not wrong, and it is often the clearest choice for beginners or for code involving side effects like printing progress messages. The apply family, however, tends to produce shorter, more declarative code, since it clearly states "apply this function to every element," and it also directly returns a usable result rather than requiring you to manually create an empty container and fill it up step by step.

```r
# The for loop way
squares <- vector("numeric", 5)
for (i in 1:5) {
  squares[i] <- i^2
}

# The apply family way, same result in one line
squares <- sapply(1:5, function(x) x^2)
```

## 📋 lapply(): always returns a list

`lapply()`, short for "list apply," applies a function to every element of a vector or list, and always returns the result as a list, no matter what kind of input you gave it.

```r
numbers <- c(1, 2, 3)
result <- lapply(numbers, function(x) x^2)
print(result)
# [[1]] 1
# [[2]] 4
# [[3]] 9
```

> [!note] Why lapply always returns a list
> Returning a list guarantees consistency, since a list can hold absolutely anything, including results of different lengths or types for each input. This predictability is exactly why `lapply()` is often used as the safe, reliable base that other apply functions, and much of the tidyverse's functional programming tools, are built on top of.

## 🔢 sapply(): the "simplified" version

`sapply()`, short for "simplify apply," works almost identically to `lapply()`, but it attempts to simplify the result into a plain vector or matrix whenever the output allows for it, which is usually more convenient to work with directly.

```r
sapply(1:5, function(x) x^2)
# 1 4 9 16 25, a plain numeric vector, not a list
```

> [!warning] sapply's simplification can be unpredictable
> Because `sapply()` decides how to simplify the result based on what the individual pieces of output look like, its return type can change unexpectedly depending on the data. If every result is a single number, you get a vector, but if the results have inconsistent lengths, you might silently get a list back instead, without any obvious warning. This inconsistency is exactly the problem that `vapply()` was designed to solve.

## ✅ vapply(): a safer, more predictable sapply

`vapply()` works like `sapply()`, but it forces you to explicitly state what type and length of output you expect, and it will throw an immediate, clear error if the actual result does not match. This makes it noticeably safer for use inside larger scripts or packages, where a silently wrong data type could cause confusing bugs much further downstream.

```r
vapply(1:5, function(x) x^2, FUN.VALUE = numeric(1))
# 1 4 9 16 25, but now with a guarantee that each result really is a single number
```

> [!tip] Prefer vapply over sapply in serious code
> Many experienced R programmers default to `vapply()` over `sapply()` specifically because of this predictability guarantee, reserving `sapply()` for quick, throwaway, interactive exploration where you can immediately see and verify the output yourself.

## 🧮 mapply(): applying a function across multiple vectors at once

Where `sapply()` and `lapply()` only loop through a single vector, `mapply()`, short for "multivariate apply," loops through several vectors in parallel, feeding one element from each into the function at the same time.

```r
add_two <- function(a, b) a + b
mapply(add_two, c(1, 2, 3), c(10, 20, 30))
# 11 22 33
```

## 🗂️ tapply(): applying a function within groups

`tapply()`, short for "table apply," is specifically built for grouped summary calculations, splitting a vector into groups based on a factor, and applying a function separately within each group.

```r
scores <- c(88, 92, 79, 95, 61, 70)
subject <- factor(c("Math", "Math", "Science", "Science", "Art", "Art"))

tapply(scores, subject, mean)
#     Art    Math Science
#    65.5    90.0    87.0
```

> [!tip] tapply as a base R alternative to group_by and summarize
> If you are familiar with the tidyverse workflow in [[R dplyr & Tidyverse]], `tapply()` accomplishes a similar grouped summary in base R, though most people find the `group_by()` and `summarize()` combination more readable once a dataset has several grouping variables at once.

## 🧾 apply(): looping across rows or columns of a matrix

`apply()` is specifically designed for matrices and data frames, letting you apply a function across either every row or every column, controlled by a margin argument.

```r
m <- matrix(1:6, nrow = 2)

apply(m, 1, sum)   # margin = 1 means "by row," sums each row
apply(m, 2, sum)   # margin = 2 means "by column," sums each column
```

> [!note] Remembering the margin argument
> A helpful memory trick is that the number 1 looks like a tall, vertical row indicator moving downward, and the number 2 evokes the horizontal spread of columns side by side. If that does not stick, it is always fine to simply remember: 1 is rows, 2 is columns, and to double check with a small test example whenever you are unsure.

## 🧮 Quick comparison table

| Function | Input | Output | Best for |
|---|---|---|---|
| `lapply()` | Vector or list | Always a list | Safe, general purpose looping |
| `sapply()` | Vector or list | Simplified vector or matrix | Quick interactive exploration |
| `vapply()` | Vector or list | Simplified, with guaranteed type | Robust, production quality code |
| `mapply()` | Multiple vectors | Simplified vector or matrix | Looping over several inputs in parallel |
| `tapply()` | Vector plus a grouping factor | A table of results per group | Grouped summary statistics |
| `apply()` | Matrix or data frame | Vector, matrix, or list | Row-wise or column-wise operations |

## 🔗 Where to go next

Once these feel natural, you will notice the apply family and vectorized thinking underpin nearly every other note in this folder. See [[R dplyr & Tidyverse]] for the modern tidyverse equivalent tools, `map()` and its variants from the purrr package, which extend these same ideas even further.
