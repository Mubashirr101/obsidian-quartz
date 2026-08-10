---
title: 🧮 R
tags: [r, programming, moc, index]
aliases: [R Programming, R Language]
status: evergreen
---

# 🧮 R

## 👋 Introduction

R is a programming language that was built specifically for statistics, data analysis, and data visualization. It was created by Ross Ihaka and Robert Gentleman in the early 1990s at the University of Auckland, and it grew out of an older language called S. Because R was designed from the ground up by statisticians, for statisticians, almost everything in the language feels tailored toward working with data. Vectors are a core building block instead of an afterthought, functions for statistical tests come built in, and plotting a graph is something you can do in a single line of code.

R is what is called a vectorized language. This means that instead of writing a loop to apply an operation to every item in a list one at a time, you can usually apply the operation to an entire vector at once, and R will handle the looping internally, much faster than a manual loop would run. This vectorized way of thinking is one of the biggest mental shifts for people coming from languages like Python or Java, and it shows up again and again throughout this folder.

R today is used heavily in academic research, biostatistics, pharmaceutical research, finance, and increasingly in general data science alongside Python. Its main package ecosystem is called CRAN (the Comprehensive R Archive Network), and its most popular modern toolkit is called the tidyverse, a collection of packages that make data cleaning, transformation, and visualization much more consistent and readable.

> [!note] Why learn R alongside Python
> R and Python are often seen as competitors, but in the data world they are more like specialized tools. Python is a general purpose language that is also great at data science. R was built for data science first, and everything else came later. Knowing both gives you flexibility, since some industries such as biostatistics and academic research still lean heavily on R.

## 🧭 How this folder is organized

This folder covers R from the ground up, moving from the absolute basics of syntax through to more advanced object oriented programming concepts. Every note in this folder assumes you may not remember the previous note, so explanations are written to stand on their own, though wikilinks are used throughout to connect related ideas.

## 📚 Map of Content

### Foundations
- [[R Basics & Syntax]] - variables, assignment, comments, operators, and the general shape of an R script
- [[R Vectors & Data Types]] - the atomic vector, R's most fundamental data structure, and the data types it can hold
- [[R Data Structures]] - lists, matrices, arrays, and factors
- [[R Data Frames]] - the workhorse structure for tabular data in R

### Program flow and reusable code
- [[R Control Flow]] - if/else statements, for loops, while loops, and repeat loops
- [[R Functions]] - writing your own functions, arguments, defaults, and scope
- [[R Apply Family]] - the vectorized alternative to loops (sapply, lapply, vapply, mapply, tapply)

### Working with real world data
- [[R String Manipulation & Regex]] - manipulating text and pattern matching
- [[R Dates & Times]] - handling calendar dates, timestamps, and time zones
- [[R Data Import Export]] - reading and writing CSV, Excel, and other file formats

### The tidyverse and visualization
- [[R dplyr & Tidyverse]] - the modern, readable approach to data wrangling
- [[R ggplot2 Visualization]] - the grammar of graphics approach to plotting

### Advanced concepts
- [[R Object Oriented Programming]] - S3, S4, and R6 class systems
- [[R Error Handling & Debugging]] - tryCatch, warnings, and debugging tools
- [[R Packages & Environments]] - installing packages, namespaces, and how R finds variables

## 🚀 Quick reference: the shape of an R script

Before diving into the individual notes, here is a small example that touches many of the ideas covered in this folder, just so you can see how they fit together in a real script.

```r
# Load a package (a bundle of extra functions)
library(dplyr)

# Create a vector of numbers
scores <- c(88, 92, 79, 95, 61)

# Create a function that labels a score as pass or fail
label_score <- function(score) {
  if (score >= 70) {
    return("Pass")
  } else {
    return("Fail")
  }
}

# Apply the function across the whole vector at once (vectorized thinking)
results <- sapply(scores, label_score)

# Combine everything into a data frame (a table)
report <- data.frame(scores, results)

print(report)
```

> [!tip] Reading R code out loud
> When you are new to R, try reading assignments like `scores <- c(88, 92, 79, 95, 61)` out loud as "scores gets the combined values 88, 92, 79, 95, and 61." Saying it this way instead of just "scores equals" helps build the mental model that `<-` means "put this value into that name," which is slightly different from how `=` is often taught in math class.

