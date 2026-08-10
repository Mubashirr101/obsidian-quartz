---
title: 🔡 R String Manipulation & Regex
tags: [r, programming, strings, regex, text]
aliases: [R Strings, R Regular Expressions]
status: evergreen
---

# 🔡 R String Manipulation & Regex

## 🧠 What this note covers

Text data shows up constantly in real world work, whether it is cleaning up messy survey responses, extracting information from log files, or parsing dates out of filenames. This note covers R's base functions for working with character strings, then introduces regular expressions, a mini language for describing text patterns that dramatically expands what you can search for and extract.

## ✂️ Basic string functions

```r
nchar("hello")            # 5, counts the number of characters
toupper("hello")           # "HELLO"
tolower("HELLO")            # "hello"
trimws("  hello  ")          # "hello", removes leading and trailing whitespace

substr("hello world", 1, 5)   # "hello", extracts characters from position 1 through 5
```

> [!note] substr can also assign, not just extract
> A less known feature is that `substr()` can be used on the left side of an assignment to replace a portion of a string in place, for example `substr(x, 1, 1) <- "H"` would replace just the first character of `x`.

## 🔗 Combining strings

```r
paste("hello", "world")          # "hello world", joins with a space by default
paste("hello", "world", sep = "-")  # "hello-world", custom separator
paste0("hello", "world")           # "helloworld", shorthand for sep = ""

paste(c("a", "b", "c"), collapse = ", ")   # "a, b, c", joins ALL elements of a vector into one string
```

> [!warning] paste versus paste0, and the collapse trap
> `paste0()` is simply `paste()` with the separator already set to an empty string, so use it whenever you want to glue text together with no space in between. Separately, the `collapse` argument is easy to confuse with `sep`. Use `sep` to control the space between two separate arguments you passed in, and use `collapse` to control how the multiple elements inside a single vector get flattened into one combined string.

## 🔎 Splitting strings

```r
strsplit("a,b,c", split = ",")
# returns a LIST containing one character vector: "a" "b" "c"

strsplit("a,b,c", split = ",")[[1]]   # unwrap the list to get the plain vector directly
```

> [!note] Why strsplit returns a list
> `strsplit()` is designed to work on an entire vector of strings at once, potentially splitting each one into a different number of pieces. Since the results can have different lengths for each input string, a list is the only structure flexible enough to hold them all consistently, which is the same underlying reasoning covered for `lapply()` in [[R Apply Family]].

## 🔍 Searching within strings

```r
grepl("wor", "hello world")     # TRUE, checks whether the pattern exists, returns logical
grep("wor", c("hello world", "goodbye"))  # 1, returns the POSITION of matches within a vector
grep("wor", c("hello world", "goodbye"), value = TRUE)  # "hello world", returns the actual matching values

sub("world", "there", "hello world")     # "hello there", replaces only the FIRST match
gsub("o", "0", "hello world")             # "hell0 w0rld", replaces ALL matches ("global sub")
```

> [!tip] Remembering sub versus gsub
> The "g" in `gsub()` stands for "global," meaning it replaces every single match it finds in the string, while plain `sub()` stops after replacing just the first match it encounters.

## 🧬 Regular expressions

A regular expression, often shortened to "regex," is a compact pattern language for describing text to search for, far more powerful than searching for an exact literal phrase. All of the searching functions above, `grepl()`, `grep()`, `sub()`, and `gsub()`, actually accept full regular expressions in their pattern argument, not just plain literal text.

### Common regex building blocks

| Pattern | Meaning | Example match |
|---|---|---|
| `.` | Any single character | `a.c` matches "abc", "axc" |
| `*` | Zero or more of the previous character | `ab*` matches "a", "ab", "abbb" |
| `+` | One or more of the previous character | `ab+` matches "ab", "abbb", but not "a" |
| `?` | Zero or one of the previous character | `colou?r` matches "color" and "colour" |
| `^` | Anchors to the start of the string | `^hello` only matches at the beginning |
| `$` | Anchors to the end of the string | `world$` only matches at the very end |
| `[abc]` | Any one character from this set | `[aeiou]` matches any single vowel |
| `[^abc]` | Any character NOT in this set | `[^0-9]` matches anything that is not a digit |
| `\\d` | Any digit | matches "0" through "9" |
| `\\w` | Any word character (letter, digit, underscore) | |
| `\\s` | Any whitespace character | |
| `{n}` | Exactly n repetitions of the previous element | `\\d{4}` matches exactly four digits |

```r
grepl("^\\d{3}-\\d{4}$", "555-1234")   # TRUE, checks for a phone number style pattern
gsub("[aeiou]", "*", "hello world")     # "h*ll* w*rld", replaces every vowel
```

> [!warning] Double backslashes in R strings
> In R, a single backslash inside a regular string is used as an escape character for things like `\n` (newline) and `\t` (tab). Because of this, if you want to actually type a literal backslash for regex purposes, such as `\d` for "any digit," you need to double it up as `\\d` so that R correctly interprets it as a single literal backslash being passed into the regex engine.

### Extracting matched text

```r
text <- "Order number: 48291"
regmatches(text, regexpr("\\d+", text))
# "48291", extracts the actual matched digits out of the string
```

> [!tip] regexpr finds the position, regmatches extracts the text
> These two functions are almost always used together. `regexpr()` finds where in the string a match starts and how long it is, while `regmatches()` uses that positional information to actually pull out the matching substring itself. If you need every match in a string rather than just the first one, use `gregexpr()` paired with `regmatches()` instead.

## 📦 stringr: the tidyverse alternative

Base R's string functions work fine, but their names are famously inconsistent, for instance `grepl()` and `nchar()` sound nothing alike despite being related. The stringr package, part of the tidyverse, offers a much more consistently named set of functions that all start with `str_`.

```r
library(stringr)

str_detect("hello world", "wor")     # equivalent to grepl()
str_replace("hello world", "world", "there")   # equivalent to sub()
str_replace_all("hello world", "o", "0")         # equivalent to gsub()
str_split("a,b,c", ",")                            # equivalent to strsplit()
str_extract("Order number: 48291", "\\d+")          # equivalent to regmatches + regexpr combined
```

> [!tip] Why many people prefer stringr
> Beyond the consistent naming, every stringr function is also designed so the string being worked on is always the first argument, which makes it fit naturally into tidyverse pipe chains, a style covered in [[R dplyr & Tidyverse]].

## 🔗 Where to go next

Text manipulation frequently overlaps with cleaning messy real world data, so [[R Data Import Export]] and [[R dplyr & Tidyverse]] are natural next stops. If your text data includes dates buried inside strings, [[R Dates & Times]] covers how to parse them out properly.
