---
title: 🗂️ R Data Frames
tags: [r, programming, dataframes, tabular-data]
aliases: [R DataFrame, data.frame]
status: evergreen
---

# 🗂️ R Data Frames

## 🧠 What this note covers

The data frame is the structure you will spend the vast majority of your time working with in R, because it is the natural way to represent a spreadsheet-like table, with rows representing observations and columns representing variables. This note explains how to build, inspect, subset, and modify data frames using base R. For a more modern and often more pleasant way to manipulate data frames, see [[R dplyr & Tidyverse]] once you are comfortable with the basics here.

## 🧱 What is a data frame

A data frame is essentially a list of vectors that are all forced to be the same length, displayed together as a table. Each column can hold a different data type from the other columns, which is exactly what makes a data frame different from a matrix, where every single cell must share the same type.

```r
students <- data.frame(
  name = c("Amit", "Sara", "Wei"),
  age = c(21, 22, 23),
  passed = c(TRUE, FALSE, TRUE)
)

print(students)
#    name age passed
# 1  Amit  21   TRUE
# 2  Sara  22  FALSE
# 3   Wei  23   TRUE
```

> [!note] Data frame as a list under the hood
> Because a data frame is built on top of a list, the double bracket rules from [[R Data Structures]] apply here too. Running `students[["name"]]` or `students$name` gives you back the raw name vector, while `students["name"]` gives you back a smaller one column data frame.

## 🔍 Inspecting a data frame

Before doing anything with a new dataset, it is good practice to get an overview of its shape and contents.

```r
str(students)      # shows the structure: column names, types, and a preview of values
head(students)      # shows the first 6 rows by default (or fewer if the data is smaller)
tail(students)       # shows the last 6 rows
nrow(students)        # number of rows
ncol(students)         # number of columns
dim(students)           # a vector with both: rows first, then columns
colnames(students)       # the column names
summary(students)         # summary statistics for every column, tailored to each column's type
```

> [!tip] str() is often the most useful first command
> When you load a brand new dataset, running `str()` on it first is one of the best habits you can build. It instantly tells you the type of every column, which catches problems early, for example noticing that a column you expected to be numeric was actually loaded as character because of a stray text value somewhere in the data.

## 🎯 Selecting rows and columns

Data frames use the same two dimensional `[row, column]` indexing style as matrices, but with a lot more flexibility, since you can mix numbers, names, and logical conditions.

```r
students[1, ]              # the entire first row
students[, "age"]           # the entire age column, as a plain vector
students[, "age", drop = FALSE]  # the age column, kept as a one column data frame
students[1:2, c("name", "age")]  # first two rows, only the name and age columns

students[students$age > 21, ]     # every row where age is greater than 21
students[students$passed == TRUE, "name"]  # names of only the students who passed
```

> [!warning] The drop argument and its default behavior
> By default, when you select a single column using bracket notation like `students[, "age"]`, R "drops" the data frame structure and gives you back a plain vector instead. This is usually convenient, but it can cause errors deeper in a script if some later code expects a data frame with one column rather than a bare vector. Adding `drop = FALSE` prevents this simplification.

## ➕ Adding and modifying columns

```r
students$grade <- c("A", "C", "B")     # adds a brand new column
students$age <- students$age + 1        # modifies every value in an existing column
students$passed <- NULL                  # setting a column to NULL removes it entirely
```

## 🔗 Combining data frames

```r
more_students <- data.frame(name = "Priya", age = 20, grade = "A")
rbind(students, more_students)    # "row bind," stacks data frames on top of each other

extra_info <- data.frame(city = c("Mumbai", "Delhi", "Pune"))
cbind(students, extra_info)       # "column bind," places data frames side by side
```

> [!warning] rbind requires matching columns
> For `rbind()` to work, both data frames need the exact same column names in the same order. This is one of the most common errors beginners run into, especially when combining data pulled from two slightly different sources. Always check column names with `colnames()` on both data frames first if you run into an error here.

## 🧮 Sorting a data frame

```r
students[order(students$age), ]              # sorts by age, ascending order
students[order(-students$age), ]               # sorts by age, descending order (the minus sign flips it)
students[order(students$grade, students$age), ] # sorts by grade first, then by age within each grade
```

## 🕳️ Handling missing data in a data frame

```r
students$age[2] <- NA          # manually introduce a missing value for this example
is.na(students$age)             # returns a logical vector showing which entries are missing
sum(is.na(students$age))         # counts how many missing values exist, since TRUE counts as 1
na.omit(students)                 # returns a new data frame with any row containing NA removed entirely
complete.cases(students)           # returns a logical vector, TRUE for rows with no missing values at all
```

> [!tip] Think before you drop missing data
> It is tempting to reach straight for `na.omit()` whenever you see missing values, but dropping rows entirely can quietly bias your analysis, especially if the missing values are not random. It is often worth investigating why a value is missing, and considering whether imputing a reasonable substitute value makes more sense than deleting the whole row.

## 🧾 Data frame versus tibble

If you install and load the tidyverse (covered fully in [[R dplyr & Tidyverse]]), you will encounter a close cousin of the data frame called a tibble. A tibble behaves almost identically to a data frame but with a handful of quality of life improvements, such as printing only a reasonable number of rows and columns by default, and never silently converting text columns into factors the way older versions of base R data frames used to.

```r
library(tibble)
students_tbl <- as_tibble(students)
```

> [!note] You do not need to choose one forever
> Most modern R code, especially anything using the tidyverse, works with tibbles, while a lot of older base R code and many textbooks still use plain data frames. In practice you will move between both freely, and functions generally accept either one without complaint.

## 🔗 Where to go next

Understanding data frames deeply is what unlocks the rest of practical R. Continue to [[R dplyr & Tidyverse]] to see a cleaner, more readable syntax for everything covered here, or move to [[R ggplot2 Visualization]] to start turning these tables into charts.
