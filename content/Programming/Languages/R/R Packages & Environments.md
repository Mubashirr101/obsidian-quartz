---
title: 📦 R Packages & Environments
tags: [r, programming, packages, cran, environments, namespaces]
aliases: [R CRAN, R library, R Environments]
status: evergreen
---

# 📦 R Packages & Environments

## 🧠 What this note covers

A package is a bundle of R functions, data, and documentation that someone has written and shared, ready for you to install and reuse instead of writing everything from scratch yourself. This note covers how to install and load packages, where R actually looks to find them, and the concept of environments, which explains how R keeps track of which variables and functions are visible at any given moment.

## 📥 Installing and loading packages

Installing a package downloads it onto your computer, a one time action, while loading a package with `library()` makes its functions available in your current session, something you need to do every time you start a new R session.

```r
install.packages("dplyr")   # only needs to be run once per computer, downloads the package
library(dplyr)                 # run this every time you start a new session and want to use it
```

> [!warning] install.packages needs quotes, library does not strictly need them
> A subtle but common point of confusion: `install.packages()` requires the package name to be in quotation marks, since it is genuinely being treated as text. `library()`, however, is written specially so that it accepts the package name either with or without quotes, for convenience, though using quotes consistently is never wrong and can avoid confusion.

## 🌐 CRAN and other package sources

Most R packages live on CRAN, the Comprehensive R Archive Network, which is R's official, heavily vetted central package repository. Some packages, particularly newer or more experimental ones, are instead only available on GitHub.

```r
install.packages("dplyr")   # installs from CRAN, the default and most common source

# Installing directly from GitHub requires the devtools or remotes package first
install.packages("remotes")
remotes::install_github("username/repository")
```

> [!note] The double colon syntax
> Writing `remotes::install_github(...)` calls the `install_github()` function that lives specifically inside the remotes package, without needing to load the entire package with `library()` first. This double colon syntax is especially useful when you only need a single function from a package just once, or when two different loaded packages happen to have a function with the exact same name and you need to specify precisely which one you mean.

## 🔎 Checking what is installed and loaded

```r
installed.packages()      # lists every package currently installed on your machine
(.packages())               # lists packages currently loaded in this session
search()                     # shows the full search path, explained further below

packageVersion("dplyr")       # checks which version of a specific package you have installed
```

## 🧭 The search path and function masking

When you type a function name, R searches through a specific ordered list of environments, called the search path, to find a matching function, starting from your own current workspace and moving outward. When two loaded packages both define a function with the same name, the one loaded most recently "masks," or takes priority over, the earlier one.

```r
library(dplyr)   # dplyr's filter() function
library(stats)     # stats also has its own filter() function, for time series

filter(x, ...)      # this will now use dplyr's version, since dplyr was loaded second
stats::filter(x, ...)  # explicitly specify the stats package version instead, overriding the default
```

> [!warning] Masking messages are worth reading, not ignoring
> When you load a package like dplyr, R often prints a small message listing which functions from previously loaded packages are now being masked. It is worth actually reading these messages the first time you load a new package, since silently using the wrong version of a same-named function is a genuinely common source of confusing bugs, especially with common names like `filter` or `select`.

## 🌳 What is an environment

An environment in R is essentially a container that holds a set of names, each pointing to a value, similar in spirit to a list, but with a few important differences: environments are always modified in place (reference semantics, the same concept introduced with R6 objects in [[R Object Oriented Programming]]), and every single function call in R actually creates its own temporary environment behind the scenes.

```r
e <- new.env()
assign("x", 10, envir = e)   # manually place a variable named x into this environment
get("x", envir = e)            # retrieve it back out, 10
ls(e)                            # lists all variable names currently held in this environment
```

> [!note] Why every function call gets its own environment
> This is exactly the underlying mechanism behind the scope rules explained in [[R Functions]]. Every time a function runs, R automatically creates a fresh, temporary environment just for that call, which is why a variable created inside a function normally disappears the moment the function finishes, unless you specifically use the `<<-` super assignment operator to reach outside of it.

## 🌍 The global environment

The environment you are working in directly at the R console, or at the top level of a script, is called the global environment. Every variable you create at the very top level of your script, outside of any function, lives here.

```r
globalenv()      # returns a reference to the global environment itself
environment()      # when run at the top level, also returns the global environment
```

> [!tip] Clearing your environment for a clean slate
> `rm(list = ls())` removes every single variable from your current environment, giving you a completely clean slate. This is commonly used at the very start of a script during development, to make sure your code genuinely works from scratch, rather than accidentally depending on some leftover variable from an earlier, different run that happens to still be sitting in memory.

## 🗂️ Namespaces: how packages avoid stepping on each other

A namespace is closely related to an environment, but specifically refers to the private collection of functions that belong to one particular package. Namespaces are exactly what allow two different packages to each safely define their own function called, say, `summary()`, without directly conflicting, since each package's version lives inside its own separate, protected namespace, only becoming ambiguous once both are loaded and searched together as described above.

> [!tip] The practical takeaway on namespaces
> You do not need to manually manage namespaces yourself in everyday use, since R and the package system handle this automatically behind the scenes. The main practical thing worth remembering is that the double colon syntax, such as `dplyr::filter()`, is always available as an escape hatch to be perfectly explicit about exactly which package's version of a function you mean, whenever there is any doubt.

## 🔗 Where to go next

This note closes the loop on how R organizes and finds code, tying back to the scope concepts first introduced in [[R Functions]]. From here, revisit the [[R]] main note for the full map of everything covered across this folder, or dive back into [[R dplyr & Tidyverse]] and [[R ggplot2 Visualization]] to put the whole toolkit into practice on a real dataset.
