---
title: 🔗 Linux Piping & Redirection
tags: [linux, pipes, redirection, stdin, stdout, stderr]
aliases: [Linux Pipes, stdout, stderr, stdin]
status: evergreen
---

# 🔗 Linux Piping & Redirection

## 🧠 What this note covers

One of the most powerful ideas in Linux is that small, simple commands can be combined together into much more powerful chains, each one feeding its output directly into the next. This note explains the three data streams every command has available, how to redirect them to and from files, and how to connect separate commands together using a pipe, which together form the backbone of countless one line commands you will encounter across [[Linux Text Processing (grep sed awk)]] and beyond.

## 🌊 The three standard streams

Every single command running in Linux has access to three standard data streams, referred to by both a name and a number.

| Stream | Number | Purpose |
|---|---|---|
| stdin (standard input) | 0 | Where a command reads its input from, normally your keyboard |
| stdout (standard output) | 1 | Where a command sends its normal, successful output, normally your screen |
| stderr (standard error) | 2 | Where a command sends its error messages, also normally your screen |

> [!note] Why errors get their own separate stream
> It might seem odd at first that normal output and error messages both show up on your screen by default, yet are considered two entirely separate streams internally. This separation exists specifically so that you can redirect them independently, for example saving a program's normal output to a log file while still letting any error messages appear directly on your screen where you will actually notice them immediately.

## ➡️ Redirecting output: > and >>

```bash
ls -la > filelist.txt          # redirects stdout into a file, OVERWRITING it completely if it already exists
ls -la >> filelist.txt           # redirects stdout into a file, APPENDING to the end instead of overwriting
```

> [!warning] A single > will silently destroy existing content
> Using a single greater-than sign will completely erase whatever was previously in the destination file before writing the new content, with absolutely no warning or confirmation. If your intention is to add new content onto the end of an existing file rather than replace it, you need the double `>>` instead. Mixing these two up is a very common and sometimes painful mistake, especially when redirecting into a file you meant to only add to.

## ⬅️ Redirecting input: <

```bash
sort < names.txt   # feeds the contents of names.txt in as stdin, rather than sort waiting for keyboard input
```

> [!note] Redirecting input is less common than redirecting output
> In everyday use, redirecting a command's output to save it somewhere is far more common than explicitly redirecting a file in as input, mostly because most commands, like `sort` and `grep`, are already happy to accept a filename directly as an argument instead, such as `sort names.txt`, achieving the same practical result more simply.

## ⚠️ Redirecting error messages separately: 2>

```bash
some_command > output.txt 2> errors.txt
# normal output goes into output.txt, and any error messages go into a completely separate errors.txt file

some_command > everything.txt 2>&1
# redirects stdout into the file first, and THEN redirects stderr to follow stdout into that same destination
```

> [!warning] The order in 2>&1 genuinely matters
> The syntax `2>&1` needs to come after the stdout redirection in order to work correctly, since it means "send stream 2 (stderr) to wherever stream 1 (stdout) is currently pointing." Writing `2>&1 > everything.txt` in the wrong order would instead send stderr to your screen first, and only redirect stdout afterward into the file, which is very likely not what was intended.

```bash
some_command > /dev/null 2>&1
# a very common pattern: throws away BOTH normal output and error messages entirely
```

> [!tip] /dev/null as a black hole for unwanted output
> `/dev/null` is a special file that Linux provides which simply discards absolutely anything written into it, and always reports itself as empty when read from. Redirecting a command's output into `/dev/null` is the standard way to run something while completely suppressing its output, commonly seen in scheduled scripts, covered in [[Linux Cron & Task Scheduling]], where nobody is around to actually read the output live anyway.

## 🔀 The pipe: connecting commands together

The pipe symbol, a single vertical bar `|`, takes the standard output of the command on its left and feeds it directly in as the standard input of the command on its right, letting you chain together simple commands into a single powerful sequence.

```bash
ls -la | grep ".txt"
# lists files, then filters that listing down to only lines containing ".txt"

cat access.log | grep "404" | wc -l
# reads a log file, filters down to lines mentioning "404," then counts how many such lines exist

ps aux | grep "python" | awk '{print $2}'
# lists running processes, filters to ones mentioning "python," then extracts just their process ID column
```

> [!tip] Building a pipeline one step at a time
> A genuinely useful habit when building a long chain of piped commands is to construct and test it one single piece at a time, running just the first command alone first to confirm its output looks right, then adding the next piped command, checking the result again, and so on. Trying to write a five-stage pipeline perfectly in one attempt is much harder than building it up incrementally and verifying each stage as you go.

## 🧮 Combining pipes and redirection together

Pipes and file redirection are frequently used together in the same command, and it helps to read the whole line from left to right as a clear sequence of steps.

```bash
grep "error" app.log | sort | uniq -c | sort -rn > error_summary.txt
```

Reading this pipeline step by step:
1. `grep "error" app.log` finds every line mentioning "error"
2. `sort` arranges those matching lines alphabetically, a required step before the next stage
3. `uniq -c` collapses duplicate lines together, prefixing each one with a count of how many times it appeared
4. `sort -rn` sorts those counts numerically, in reverse order, so the most frequent errors appear first
5. `> error_summary.txt` saves the final, fully processed result into a file instead of just printing it to the screen

> [!tip] uniq -c is a fantastic quick frequency counter
> The specific combination of `sort` followed by `uniq -c` followed by `sort -rn` is one of the most useful command line patterns to genuinely memorize, since it instantly turns any list of repeated text values, whether that is error messages, visited URLs, or usernames, into a clean, ranked frequency count, all without writing a single line of a real programming language.

## 🧵 tee: splitting output to both a file and the screen

Sometimes you want a command's output to be saved into a file and also still be visible on your screen at the same time, rather than choosing one or the other. The `tee` command, named after a plumbing T-shaped pipe fitting, handles exactly this.

```bash
ls -la | tee filelist.txt
# shows the listing on screen AS NORMAL, while simultaneously also saving a copy into filelist.txt

ls -la | tee -a filelist.txt
# the -a flag appends to the file instead of overwriting it, same idea as >>
```

## 🔗 Where to go next

Piping and redirection are the connective tissue that makes the individual tools in [[Linux Text Processing (grep sed awk)]] genuinely powerful when chained together. Continue to [[Linux Shell Scripting]] to see how these same ideas get wrapped into fully reusable, saved scripts rather than one-off typed commands.
