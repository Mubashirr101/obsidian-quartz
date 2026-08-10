---
title: 🧱 R Data Structures
tags: [r, programming, lists, matrices, arrays, factors]
aliases: [R Lists, R Matrices, R Factors]
status: evergreen
---

# 🧱 R Data Structures

## 🧠 What this note covers

While [[R Vectors & Data Types]] covered the atomic vector, real programs need more complex containers to organize data. This note walks through the four other core structures you will meet constantly in R: the list, the matrix, the array, and the factor. Each one solves a different organizational problem, and knowing when to reach for which one is a key skill.

## 📋 Lists

A list is like a vector, but with one crucial difference: a single list can hold elements of completely different types, and even other lists inside itself. Where a vector demands that every element share the same type, a list has no such restriction.

```r
person <- list(name = "Amit", age = 30, is_student = FALSE)
print(person)
```

### Accessing elements in a list

R gives you two different bracket styles for lists, and the difference between them trips up almost everyone at first.

```r
person["name"]    # single brackets: returns a smaller LIST containing just that element
person[["name"]]  # double brackets: returns the actual VALUE inside, "Amit"
person$name       # the dollar sign shortcut: also returns the actual VALUE, "Amit"
```

> [!warning] Single brackets versus double brackets
> Single square brackets `[ ]` always return the same type of container you started with, so subsetting a list with single brackets gives you back a smaller list. Double square brackets `[[ ]]` and the dollar sign `$` reach inside and pull out the actual content. This distinction becomes very important once you start passing values into functions, since a function expecting a plain number will fail if you accidentally give it a one-item list instead.

### Modifying a list

```r
person$age <- 31          # update an existing element
person$city <- "Mumbai"    # add a brand new element
person$is_student <- NULL  # setting an element to NULL removes it entirely
```

### Nested lists

```r
family <- list(
  father = list(name = "Rajesh", age = 55),
  mother = list(name = "Sunita", age = 52)
)
family$father$name    # "Rajesh", chaining dollar signs to go deeper
```

## 🔲 Matrices

A matrix is a two dimensional grid of values, where, just like a vector, every single element must share the same data type. Think of it as a vector that has been organized into rows and columns.

```r
m <- matrix(1:6, nrow = 2, ncol = 3)
print(m)
#      [,1] [,2] [,3]
# [1,]    1    3    5
# [2,]    2    4    6
```

> [!note] Matrices fill by column, not by row
> By default, R fills a matrix column by column, not row by row, which surprises people coming from languages where the natural reading order is left to right, top to bottom. If you want R to fill row by row instead, add the argument `byrow = TRUE`.

```r
matrix(1:6, nrow = 2, byrow = TRUE)
#      [,1] [,2] [,3]
# [1,]    1    2    3
# [2,]    4    5    6
```

### Indexing a matrix

Matrix indexing uses two positions separated by a comma, representing row and column.

```r
m[1, 2]     # the value in row 1, column 2
m[1, ]       # the entire first row
m[, 2]       # the entire second column
```

### Matrix math

```r
m1 <- matrix(1:4, nrow = 2)
m2 <- matrix(5:8, nrow = 2)

m1 + m2       # element wise addition
m1 %*% m2     # true matrix multiplication, note the special %*% operator
t(m1)         # transpose, flips rows and columns
```

> [!tip] The %*% operator is not the same as *
> A plain asterisk `*` between two matrices multiplies them element by element, position by position. The special `%*%` operator performs actual linear algebra matrix multiplication. Confusing these two is a very common source of subtle bugs in statistical code.

## 📐 Arrays

An array generalizes the idea of a matrix beyond two dimensions. A matrix is really just a special case of an array with exactly two dimensions, but an array can have three, four, or more.

```r
arr <- array(1:24, dim = c(2, 3, 4))
# this creates 4 separate "layers," each one a 2 row by 3 column matrix
arr[1, 2, 3]   # accessing a value using row, column, and layer position
```

> [!note] When arrays actually come up
> Arrays are less common in everyday data analysis than the other structures on this page, but they show up naturally when working with things like image data, where you might need a height dimension, a width dimension, and a color channel dimension all at once.

## 🏷️ Factors

A factor is R's dedicated structure for categorical data, meaning data that falls into a fixed, limited set of categories, such as "low," "medium," and "high," or the days of the week. Under the hood, a factor stores its values as integers, paired with a lookup table of text labels, which makes it more memory efficient than storing the same category name as text over and over again.

```r
sizes <- factor(c("small", "large", "medium", "small"))
print(sizes)
levels(sizes)    # "large" "medium" "small", the unique categories, alphabetical by default
```

### Ordered factors

Sometimes categories have a natural ranking, such as a survey response of "poor," "fair," "good," and "excellent." An ordered factor preserves that ranking, which then affects how comparisons behave.

```r
rating <- factor(
  c("good", "poor", "excellent"),
  levels = c("poor", "fair", "good", "excellent"),
  ordered = TRUE
)

rating[1] > rating[2]   # TRUE, since "good" ranks higher than "poor"
```

> [!tip] Why bother with factors instead of plain text
> Factors matter for two big reasons. First, many statistical models and plotting functions in R specifically look for factors to understand which variables are categorical, and treat them differently from continuous numeric variables. Second, an ordered factor lets you sort and compare categories in a way that plain text alone cannot, since plain text would sort "excellent" and "fair" alphabetically instead of by actual rank.

> [!warning] A classic factor pitfall
> Because factors are stored internally as integers, converting one directly to a number with `as.numeric()` gives you the underlying integer codes, not the labels you can see. If you have a factor of numbers stored as text, such as `factor(c("10", "20", "30"))`, always convert to character first and then to numeric: `as.numeric(as.character(x))`, otherwise you will silently get the wrong values.

## 🧮 Quick comparison table

| Structure | Dimensions | Element types | Common use case |
|---|---|---|---|
| Vector | 1D | Single type | A single column of values |
| List | 1D | Mixed types | Grouping unrelated pieces of data, function outputs |
| Matrix | 2D | Single type | Linear algebra, numeric grids |
| Array | 3D or more | Single type | Multi dimensional numeric data, like image data |
| Factor | 1D | Categories | Representing categorical or ordinal variables |

## 🔗 Where to go next

These structures are the raw materials, but the structure you will use constantly in day to day analysis is the data frame, which combines vectors of different types into a single table. Continue to [[R Data Frames]] to see how that works, or check out [[R Apply Family]] to learn the vectorized way of looping over lists and matrices.
