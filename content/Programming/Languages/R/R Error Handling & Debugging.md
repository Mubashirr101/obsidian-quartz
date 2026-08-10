---
title: 🛡️ R Error Handling & Debugging
tags: [r, programming, error-handling, debugging, trycatch]
aliases: [R tryCatch, R Debugging]
status: evergreen
---

# 🛡️ R Error Handling & Debugging

## 🧠 What this note covers

No matter how carefully you write a script, things eventually go wrong: a file does not exist, a value is missing when your code expects a number, or an API call fails. This note covers R's tools for anticipating and gracefully handling these situations, called error handling, as well as the tools for actually investigating what went wrong when it does, called debugging.

## 🚨 The three levels of trouble: messages, warnings, and errors

R distinguishes between three different severities of problem, and understanding the difference matters for how you handle each one.

```r
message("Just some informational output")   # informational only, does not stop execution
warning("Something looks off, but continuing anyway")   # a caution, but code still keeps running
stop("Something is seriously wrong")   # a true error, immediately halts execution
```

> [!note] Errors stop your script, warnings and messages do not
> A `stop()` immediately halts the rest of your script from running, similar to throwing an exception in other languages. A `warning()` prints a caution to the console but lets the code continue running afterward, and a `message()` is simply informational, with no implication that anything is wrong at all. Knowing this distinction helps you decide which one to reach for when writing your own functions.

## 🎣 tryCatch(): catching and handling errors gracefully

`tryCatch()` lets you run a risky piece of code, and specify exactly what should happen if it produces an error, a warning, or completes successfully, instead of letting your whole script crash.

```r
safe_divide <- function(a, b) {
  tryCatch(
    {
      if (b == 0) stop("Cannot divide by zero")
      a / b
    },
    error = function(e) {
      cat("An error occurred:", conditionMessage(e), "\n")
      return(NA)
    }
  )
}

safe_divide(10, 2)   # 5
safe_divide(10, 0)   # prints the error message, then returns NA instead of crashing
```

> [!tip] conditionMessage extracts the readable error text
> Inside the `error = function(e) { ... }` block, the object `e` represents the actual error condition that was caught, and `conditionMessage(e)` pulls out just the human readable text of that error, which is useful for logging or displaying a cleaner message to a user instead of R's raw, sometimes cryptic, default error output.

### Handling warnings too

```r
tryCatch(
  {
    as.numeric("not a number")
  },
  warning = function(w) {
    cat("Caught a warning:", conditionMessage(w), "\n")
    return(NA)
  }
)
```

### The finally block

`tryCatch()` also supports a `finally` block, which runs no matter what happens, whether the code succeeded, produced a warning, or produced an error. This is most often used for cleanup tasks, such as closing a file connection or a database connection.

```r
tryCatch(
  {
    # risky code here
    stop("Something failed")
  },
  error = function(e) {
    cat("Handled the error\n")
  },
  finally = {
    cat("This always runs, no matter what\n")
  }
)
```

## 🧯 try(): a simpler, lighter alternative

`try()` is a lighter weight tool than `tryCatch()`. It simply prevents an error from stopping your script, without giving you the same fine grained control over exactly how to respond to different condition types.

```r
result <- try(log(-1), silent = TRUE)
if (inherits(result, "try-error")) {
  cat("That calculation failed\n")
}
```

> [!tip] When to reach for try versus tryCatch
> Use the simpler `try()` when you just need to prevent a single risky line from crashing your whole script and are comfortable checking afterward whether it failed. Reach for the more powerful `tryCatch()` when you need to run genuinely different code depending on whether an error, a warning, or a success occurred, or when you need a guaranteed cleanup step using `finally`.

## 🔍 Debugging tools

### print debugging

The simplest debugging technique of all is temporarily sprinkling `print()` or `cat()` statements throughout your code to inspect the value of variables at different points as the script runs.

```r
my_function <- function(x) {
  print(paste("x is currently:", x))   # a temporary debug line
  result <- x * 2
  print(paste("result is currently:", result))   # another temporary debug line
  return(result)
}
```

### browser(): pausing execution to inspect everything

`browser()` is a far more powerful debugging tool. Placing it anywhere inside a function pauses execution right at that exact point when the function runs, dropping you into an interactive session where you can inspect every variable's current value exactly as it exists at that moment.

```r
my_function <- function(x) {
  browser()   # execution pauses HERE the moment this function is called
  result <- x * 2
  return(result)
}
```

> [!tip] Using browser() effectively
> Once execution pauses at a `browser()` call, you can type any variable name to inspect its current value, type `n` to step forward to the next line, or type `c` to continue running the rest of the code normally. This is dramatically more powerful than scattering `print()` statements everywhere, since you can explore the full state of the function interactively rather than only seeing whatever you specifically decided to print in advance.

### traceback(): finding where an error actually happened

When an error occurs deep inside a chain of nested function calls, `traceback()` shows you the full sequence of calls that led to the error, which is invaluable for figuring out exactly where things actually went wrong.

```r
traceback()   # run this immediately after an error occurs, to see the full call stack
```

## ✅ Defensive programming: preventing problems before they happen

Beyond reacting to errors, it is good practice to validate your assumptions at the very start of a function, failing fast with a clear message rather than letting a bad input silently produce a confusing wrong answer much further downstream.

```r
calculate_average <- function(scores) {
  if (!is.numeric(scores)) {
    stop("scores must be a numeric vector")
  }
  if (length(scores) == 0) {
    stop("scores cannot be empty")
  }
  mean(scores)
}
```

> [!tip] Fail fast and fail clearly
> A function that immediately stops with a clear, specific message like `"scores must be a numeric vector"` is far more helpful, both to you and to anyone else using your code, than one that runs to completion and returns a subtly wrong or confusing result because of a bad input that was never checked.

## 🔗 Where to go next

Robust error handling matters most once your functions are being reused in larger scripts or shared with others. Revisit [[R Functions]] to combine these ideas with everything you already know about writing functions, or continue to [[R Packages & Environments]] to see how R organizes larger, reusable collections of code.
