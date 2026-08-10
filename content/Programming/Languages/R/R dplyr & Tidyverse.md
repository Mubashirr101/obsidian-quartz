---
title: 🧹 R dplyr & Tidyverse
tags: [r, programming, dplyr, tidyverse, data-wrangling]
aliases: [R Tidyverse, R dplyr, R Pipe]
status: evergreen
---

# 🧹 R dplyr & Tidyverse

## 🧠 What this note covers

The tidyverse is a collection of R packages, including dplyr, ggplot2, readr, tidyr, and stringr, that were all designed to share a consistent philosophy and syntax for working with data. This note focuses mainly on dplyr, the tidyverse's core package for data transformation, and the pipe operator that ties everything together. Once you are comfortable here, [[R ggplot2 Visualization]] covers the tidyverse's plotting package.

## 📦 Loading the tidyverse

```r
install.packages("tidyverse")   # only needs to be run once, ever, per machine
library(tidyverse)                # loads dplyr, ggplot2, readr, tidyr, stringr, and more, all at once
```

> [!note] The tidyverse is a package of packages
> Running `library(tidyverse)` is a convenient shortcut that loads several individual packages together, rather than being one single giant package itself. If you only need one specific piece, such as just dplyr, you can also load that alone with `library(dplyr)` to keep your environment a little lighter.

## ➡️ The pipe operator

The pipe operator takes the result on its left side and feeds it in as the first argument to the function on its right side. This lets you chain together a whole sequence of data transformation steps in a way that reads almost like a sentence, from top to bottom, instead of nesting function calls deeply inside one another.

```r
# Without the pipe, functions nest inside each other, read from the inside out
result <- arrange(filter(students, age > 21), name)

# With the pipe, the same logic reads top to bottom, in the actual order of operations
result <- students |>
  filter(age > 21) |>
  arrange(name)
```

> [!note] Two pipe symbols exist in modern R
> The tidyverse originally popularized its own pipe, written as `%>%`, which comes from the magrittr package. Since R version 4.1, a native pipe, written as `|>`, was added directly into the language itself and does not require loading any package at all. They behave almost identically for everyday use, and `|>` is now the generally recommended choice for new code, though you will very frequently still see `%>%` in existing scripts, tutorials, and older packages.

## 🔍 filter(): choosing rows

`filter()` keeps only the rows that match a given condition, replacing the more awkward base R bracket syntax shown in [[R Data Frames]].

```r
students |> filter(age > 21)
students |> filter(age > 21 & passed == TRUE)   # multiple conditions combined with AND
students |> filter(grade == "A" | grade == "B")   # multiple conditions combined with OR
students |> filter(grade %in% c("A", "B"))          # a cleaner way to check against several possible values
```

## 🎯 select(): choosing columns

`select()` keeps, drops, or reorders columns.

```r
students |> select(name, age)          # keep only these two columns, in this order
students |> select(-passed)              # keep everything EXCEPT this column
students |> select(starts_with("s"))       # keep any column whose name starts with "s"
```

## 🆕 mutate(): creating or modifying columns

`mutate()` adds a new column, or overwrites an existing one, based on a calculation.

```r
students |> mutate(age_next_year = age + 1)
students |> mutate(grade_pass = ifelse(passed, "Pass", "Fail"))
```

> [!tip] mutate can reference a column it just created
> Within a single `mutate()` call, you can build a new column and then immediately use it to build another new column right below it, all in the same call, since each line runs in the order it is written.

## 🔽 arrange(): sorting rows

```r
students |> arrange(age)              # ascending order by default
students |> arrange(desc(age))          # descending order
students |> arrange(grade, desc(age))     # sorts by grade first, then by age within each grade group
```

## 📊 summarize() and group_by(): aggregating data

`summarize()` collapses many rows down into a single summary value, such as an average, and it becomes far more powerful once paired with `group_by()`, which splits the data into groups before the summary is calculated separately within each one.

```r
students |>
  group_by(grade) |>
  summarize(
    average_age = mean(age),
    count = n()
  )
```

> [!tip] n() counts rows within the current group
> The `n()` function is a small but extremely handy dplyr helper that simply counts how many rows exist in the current group, without needing to reference any specific column. It only works meaningfully inside dplyr verbs like `summarize()` or `mutate()`.

> [!warning] Remember to ungroup afterward
> After a `group_by()` and `summarize()` combination, the resulting table is technically still marked as grouped by whatever grouping you used, which can quietly affect further calculations you chain afterward. It is good practice to add `|> ungroup()` at the end of a grouped pipeline once you are done with the grouped operations, to avoid unexpected behavior later.

## 🔗 join functions: combining two data frames

Joins combine two data frames together based on matching values in a shared column, similar to a database join.

```r
left_join(students, grades, by = "student_id")   # keeps all rows from the LEFT table, adds matches from the right
inner_join(students, grades, by = "student_id")    # keeps only rows that match in BOTH tables
full_join(students, grades, by = "student_id")      # keeps every row from BOTH tables, filling gaps with NA
anti_join(students, grades, by = "student_id")        # keeps only rows from the left table that have NO match at all
```

> [!tip] Choosing the right join type
> Think of `left_join()` as "keep everything I already have, and attach extra details if available." Think of `inner_join()` as "only keep the overlap." Think of `full_join()` as "keep absolutely everything from both sides." And `anti_join()` is specifically useful for finding what is missing, such as students who have no grade record at all.

## 🔄 tidyr: reshaping data between wide and long formats

Part of the same family, the tidyr package specializes in reshaping data between "wide" format, where each variable gets its own column, and "long" format, where variable names themselves become values in a single column.

```r
library(tidyr)

# wide format: one row per student, one column per subject
wide_data <- data.frame(student = c("Amit", "Sara"), math = c(88, 92), science = c(75, 85))

# convert to long format: one row per student PER subject
long_data <- wide_data |>
  pivot_longer(cols = c(math, science), names_to = "subject", values_to = "score")

# convert back to wide format
wide_again <- long_data |>
  pivot_wider(names_from = subject, values_from = score)
```

> [!note] Why long format is often preferred for analysis and plotting
> Long format may look less intuitive to read at first glance, but it is generally the format that both statistical models and ggplot2, covered in [[R ggplot2 Visualization]], expect and work with most naturally, since it represents each observation as a clean, single row.

## 🔗 Where to go next

With clean, well shaped data in hand, [[R ggplot2 Visualization]] is the natural next step for turning it into charts. If you want to revisit how these pipe-friendly verbs compare to base R equivalents, [[R Data Frames]] and [[R Apply Family]] cover the underlying base R approach.
