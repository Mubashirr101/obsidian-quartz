---
title: 🔎 Linux Text Processing (grep sed awk)
tags: [linux, grep, sed, awk, text-processing, regex]
aliases: [grep, sed, awk, Linux Regex]
status: evergreen
---

# 🔎 Linux Text Processing (grep sed awk)

## 🧠 What this note covers

One of Linux's defining philosophies is that everything is, or can be treated as, plain text, and there is a whole family of small, specialized tools designed to search, filter, and transform that text with tremendous power. This note covers the three most essential ones: `grep` for searching, `sed` for find-and-replace style editing, and `awk` for column based text processing, along with a handful of smaller supporting tools.

## 🔍 grep: searching for patterns in text

`grep` searches through text, line by line, and prints out any line that matches a given pattern.

```bash
grep "error" app.log             # prints every line in app.log that contains the word "error"
grep -i "error" app.log             # case insensitive search, also matches "Error" and "ERROR"
grep -r "TODO" project/               # recursive search, checks every file inside a whole folder tree
grep -n "error" app.log                 # also shows the LINE NUMBER of each match
grep -v "debug" app.log                   # inverts the match, shows every line that does NOT contain "debug"
grep -c "error" app.log                     # counts how many matching lines there are, instead of printing them
grep -l "TODO" *.py                           # lists just the FILENAMES that contain a match, not the matching lines themselves
```

> [!tip] grep accepts full regular expressions
> Beyond simple literal text, `grep` understands regular expressions, the same pattern matching language covered more fully in the R vault's string manipulation note, letting you search for far more flexible patterns than an exact phrase.

```bash
grep -E "^[0-9]{3}-[0-9]{4}$" contacts.txt   # -E enables "extended" regex, needed for things like {n} repetition
grep "^Error" app.log                          # ^ anchors the match to the START of the line
grep "failed$" app.log                           # $ anchors the match to the END of the line
```

> [!note] Basic versus extended regex in grep
> By default, `grep` uses a more limited pattern syntax called "basic regular expressions," where certain special characters like `+`, `?`, and `{}` need an extra backslash in front of them to work as patterns rather than literal characters. Adding the `-E` flag switches to "extended regular expressions," which behaves much closer to what most people expect from regex in other tools and languages, and is generally the more predictable, less surprising choice to reach for.

## ✍️ sed: the stream editor

`sed`, short for "stream editor," reads text line by line and applies transformations to it, most commonly used for find-and-replace operations, without ever opening an interactive text editor at all.

```bash
sed 's/cat/dog/' pets.txt            # replaces the FIRST occurrence of "cat" with "dog" on EACH line
sed 's/cat/dog/g' pets.txt             # the "g" flag makes it GLOBAL, replacing every occurrence on each line
sed -i 's/cat/dog/g' pets.txt            # the "-i" flag edits the file IN PLACE, saving changes directly
sed -n '5,10p' notes.txt                   # prints only lines 5 through 10 of the file
sed '/^#/d' config.txt                       # deletes every line that starts with a # (a common way to strip comments)
```

> [!warning] sed -i modifies the original file directly, with no undo
> Unlike running `sed` without `-i`, which just prints the transformed result to your screen without touching the actual file, adding `-i` overwrites the original file permanently, with no confirmation prompt and no built in undo. It is a very good habit to first run your `sed` command without `-i` to preview exactly what it would change, and only add `-i` once you are confident the pattern is correct. Some versions also support `sed -i.bak`, which saves a backup copy of the original file with a `.bak` extension before making changes.

### Understanding the sed substitution syntax

The core substitution command follows the pattern `s/find/replace/flags`, where the forward slashes act as separators between the three parts.

```bash
sed 's/find/replace/g'
#     | |    |       |
#     | |    |       flag: g means "global," replace every match on the line, not just the first
#     | |    replacement text
#     | pattern to search for
#     s means "substitute," the command itself
```

> [!tip] You can use a different separator character
> If the text you are searching for or replacing with happens to contain a forward slash itself, such as a file path, you can swap the separator character to something else entirely, like a pipe or a hash symbol, for example `sed 's#/old/path#/new/path#'`, to avoid a confusing clash with slashes that are actually part of your data.

## 📊 awk: processing text by columns

`awk` is built specifically around the idea that a line of text is often really a row of data made up of separate columns, referred to as "fields," typically separated by whitespace by default.

```bash
echo "Amit 25 Mumbai" | awk '{print $1}'    # prints just the first field: "Amit"
echo "Amit 25 Mumbai" | awk '{print $2}'    # prints just the second field: "25"
echo "Amit 25 Mumbai" | awk '{print $0}'    # $0 refers to the ENTIRE original line, all fields together

awk -F"," '{print $2}' data.csv    # -F changes the field separator, here to a comma, for reading CSV style data
```

> [!note] Why awk feels like a tiny programming language
> Unlike `grep` and `sed`, which are mostly focused on one specific task each, `awk` is genuinely closer to a small, complete programming language of its own, with variables, conditionals, and even loops available inside its command blocks. This makes it especially powerful for extracting and summarizing structured, column-based data directly from the command line, without needing to write a full separate script in a language like Python.

### A few more practical awk examples

```bash
awk '{print $1, $3}' data.txt         # prints only the first and third columns
awk '$2 > 25 {print $1}' data.txt       # prints the first column, but ONLY for rows where the second column exceeds 25
awk '{sum += $2} END {print sum}' data.txt   # adds up the second column across every line, printing the total at the very end
awk 'NR==1' data.txt                          # NR means "number of records" (the current line number), here printing only the first line
```

> [!tip] The END block runs once, after every line has been processed
> A very common awk pattern is combining an action that runs on every single line, such as adding to a running total, with a special `END { }` block that only runs once, after the entire input has been fully read, typically used to print a final summary like a total or an average.

## 🧾 A few smaller, supporting text tools

```bash
cut -d"," -f2 data.csv     # extracts just the second field from each line, splitting on a comma delimiter
sort names.txt                # sorts the lines of a file alphabetically
sort -n numbers.txt              # sorts NUMERICALLY instead of alphabetically, important for correct number ordering
sort -r names.txt                  # sorts in REVERSE order
uniq names.txt                        # removes consecutive duplicate lines (only works correctly on already sorted input)
sort names.txt | uniq                   # the extremely common combination: sort first, then remove all duplicates reliably
wc -l app.log                             # counts the number of LINES in a file
wc -w notes.txt                             # counts the number of WORDS in a file
```

> [!warning] uniq only removes ADJACENT duplicate lines
> A very common beginner mistake is running `uniq` directly on an unsorted file and being confused when obvious duplicates do not get removed. `uniq` only ever compares each line to the one immediately before it, so it only catches duplicates that are already sitting right next to each other. This is exactly why `sort` is almost always piped in first, ensuring every duplicate ends up adjacent before `uniq` ever sees it.

## 🔗 Where to go next

These text processing tools become dramatically more powerful once combined together using pipes, covered fully in [[Linux Piping & Redirection]]. Once comfortable there, [[Linux Shell Scripting]] shows how to wrap combinations like these into fully reusable, automated scripts.
