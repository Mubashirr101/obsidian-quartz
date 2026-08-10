---
title: 📁 R Data Import Export
tags: [r, programming, csv, excel, import, export]
aliases: [R Reading Files, R Writing Files]
status: evergreen
---

# 📁 R Data Import Export

## 🧠 What this note covers

Before you can analyze anything, you need to get data into R, and once you are done you usually need to save your results back out somewhere useful. This note covers reading and writing CSV files, Excel files, and R's own native file formats, along with a few tips for handling common headaches like encoding and file paths.

## 📄 Reading and writing CSV files

CSV, short for "comma separated values," is the most universal format for tabular data, since almost every tool from Excel to databases can produce and read it.

```r
# Base R approach
students <- read.csv("students.csv")
write.csv(students, "students_output.csv", row.names = FALSE)
```

> [!warning] row.names = FALSE is almost always what you want
> By default, `write.csv()` adds an extra, unwanted column containing the row numbers of your data frame. Almost every time you export a file, you want to include `row.names = FALSE` to prevent this, unless you have a specific reason to keep those row labels.

### The readr package: a faster, more consistent alternative

The tidyverse's readr package, covered more broadly in [[R dplyr & Tidyverse]], offers faster and more predictable versions of the same functions.

```r
library(readr)

students <- read_csv("students.csv")     # faster, and returns a tibble instead of a data frame
write_csv(students, "students_output.csv")   # no row.names argument needed, it never adds row numbers
```

> [!tip] Why read_csv is usually preferred over read.csv
> Beyond raw speed on large files, `read_csv()` from readr is also more predictable about how it guesses column types, gives you a clear, readable summary of what types it detected right after reading the file, and never automatically converts text columns into factors, a legacy behavior of base R's `read.csv()` that has caused countless headaches over the years.

## 📊 Reading and writing Excel files

Base R cannot read Excel files (.xlsx) natively, so you need a dedicated package. The readxl package, part of the wider tidyverse family of packages, is the standard choice for reading, and openxlsx or writexl are common choices for writing.

```r
library(readxl)
data <- read_excel("report.xlsx")                    # reads the first sheet by default
data <- read_excel("report.xlsx", sheet = "Sales")     # reads a specifically named sheet
excel_sheets("report.xlsx")                              # lists all sheet names in the file, useful to check first

library(writexl)
write_xlsx(data, "output.xlsx")
```

> [!note] Why writing needs a different package than reading
> The readxl package is intentionally read-only and has no external dependencies outside of R itself, which makes it very reliable and easy to install. Writing Excel files, however, involves generating a more complex file format, so a separate package such as writexl or openxlsx handles that side instead.

## 💾 R's native file formats: RDS and RData

When you are only ever going to reopen a file in R itself, R's own native formats are often a better choice than CSV, since they preserve the exact data types, factor levels, and structure perfectly, without needing to re-parse text on every load.

```r
saveRDS(students, "students.rds")     # saves a single R object
students <- readRDS("students.rds")    # loads it back, must assign it to a name

save(students, scores, file = "workspace.RData")   # saves MULTIPLE objects together
load("workspace.RData")                              # loads them back, restoring their ORIGINAL names automatically
```

> [!warning] saveRDS versus save, a key difference
> `saveRDS()` saves exactly one object and requires you to assign the result to a variable name when loading it back in, giving you full control to rename it if you like. `save()` can bundle multiple objects together, but when you `load()` that file, the objects reappear directly in your environment under their original saved names, which can unexpectedly overwrite an existing variable of the same name without warning.

## 🗄️ Reading data from a database

For larger datasets living in a proper database, the DBI package provides a consistent interface across many different database systems, paired with a driver package specific to the database you are connecting to, such as RSQLite or RPostgres.

```r
library(DBI)
library(RSQLite)

con <- dbConnect(RSQLite::SQLite(), "my_database.sqlite")
result <- dbGetQuery(con, "SELECT * FROM students WHERE age > 21")
dbDisconnect(con)
```

## 🧭 File paths and the working directory

R always operates relative to something called the "working directory," and understanding this is essential for avoiding "file not found" errors.

```r
getwd()             # shows your current working directory
setwd("/path/to/folder")   # changes it
```

> [!warning] Avoid hardcoded absolute paths in shared scripts
> Writing an absolute path like `setwd("C:/Users/YourName/Documents/project")` will break the moment someone else, or even future you on a different computer, tries to run the script. A far more robust approach, especially within an RStudio Project, is to use relative paths, or better yet, the here package, which automatically figures out the correct project root folder regardless of who is running the script or from where.

```r
library(here)
data <- read_csv(here("data", "students.csv"))
# builds a reliable path relative to the project root, no matter who runs it
```

## 🌍 A note on encoding

Occasionally imported text will show strange, garbled characters instead of the expected accented letters or special symbols. This is almost always an encoding mismatch, most commonly needing UTF-8 encoding specified explicitly.

```r
read_csv("data.csv", locale = locale(encoding = "UTF-8"))
```

> [!tip] When in doubt, try UTF-8 first
> UTF-8 is by far the most common modern text encoding, and specifying it explicitly resolves the vast majority of garbled character issues you will encounter when importing files created on different operating systems or exported from older software.

## 🔗 Where to go next

Once your data is loaded cleanly, [[R Data Frames]] and [[R dplyr & Tidyverse]] cover how to inspect, clean, and reshape it, while [[R ggplot2 Visualization]] covers turning it into charts.
