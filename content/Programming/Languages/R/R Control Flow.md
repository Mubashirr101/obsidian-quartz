---
title: 🔀 R Control Flow
tags: [r, programming, control-flow, loops, conditionals]
aliases: [R Loops, R If Else]
status: evergreen
---

# 🔀 R Control Flow

## 🧠 What this note covers

Control flow refers to the tools that let your code make decisions and repeat actions, instead of just running from top to bottom in a single straight line. This note covers if and else statements, the three loop types R offers, and the special keywords that let you interrupt a loop early. Keep in mind that because of R's vectorized nature (explained in [[R Vectors & Data Types]]), loops are used less often in R than in many other languages, and [[R Apply Family]] often provides a cleaner alternative.

## ❓ if, else if, and else

The `if` statement runs a block of code only when a condition is true.

```r
score <- 85

if (score >= 90) {
  print("Grade: A")
} else if (score >= 80) {
  print("Grade: B")
} else if (score >= 70) {
  print("Grade: C")
} else {
  print("Grade: F")
}
# prints "Grade: B"
```

> [!note] Curly braces are optional for a single line
> If your `if` block only contains one single line of code, the curly braces `{ }` are technically optional. Most style guides, however, still recommend always including them, since it makes the code easier to read and much safer to extend later without accidentally introducing a bug.

### The vectorized alternative: ifelse()

The regular `if` statement only evaluates a single TRUE or FALSE value at a time. When you need to apply an if/else style decision across an entire vector at once, use the dedicated `ifelse()` function instead.

```r
scores <- c(95, 60, 78, 88)
results <- ifelse(scores >= 70, "Pass", "Fail")
print(results)
# "Pass" "Fail" "Pass" "Pass"
```

> [!warning] if versus ifelse, a very common mix-up
> Trying to use a regular `if` statement directly on a multi-element vector will only look at the first element and will typically throw a warning or error in modern versions of R. Whenever you are deciding something for every element of a vector at once, reach for `ifelse()` instead of `if`.

## 🔁 The for loop

A `for` loop repeats a block of code once for every element in a sequence.

```r
for (i in 1:5) {
  print(i * 2)
}
# prints 2, 4, 6, 8, 10, each on its own line
```

You can loop over any vector or list, not just a numeric sequence.

```r
fruits <- c("apple", "banana", "mango")
for (fruit in fruits) {
  cat("I like", fruit, "\n")
}
```

> [!tip] Loop over the values you actually need, not just indices
> Beginners often default to writing `for (i in 1:length(fruits))` and then use `fruits[i]` inside the loop. This works, but it is usually cleaner and safer to loop directly over the values, as in `for (fruit in fruits)`, unless you specifically need to know the position of each element as well.

> [!warning] The empty vector trap with 1:length(x)
> If `fruits` happens to be an empty vector, `length(fruits)` is 0, and `1:0` actually produces the sequence `c(1, 0)`, not an empty sequence as you might expect. This means a loop written as `for (i in 1:length(fruits))` will run twice on empty data instead of zero times, silently causing bugs. The safer alternative is `seq_along(fruits)`, which correctly produces an empty sequence when the vector is empty.

```r
seq_along(fruits)    # the safe way to generate loop indices: 1, 2, 3
```

## 🔄 The while loop

A `while` loop keeps repeating as long as a condition stays true, and is useful when you do not know in advance exactly how many times you need to repeat something.

```r
count <- 1
while (count <= 5) {
  print(count)
  count <- count + 1
}
```

> [!warning] Watch out for infinite loops
> A `while` loop only stops once its condition becomes false. If you forget to update the variable being checked inside the loop, such as forgetting the `count <- count + 1` line above, the loop will run forever and your script will hang. Always double check that the condition being tested is guaranteed to eventually become false.

## 🔂 The repeat loop

A `repeat` loop runs forever by default, until you explicitly tell it to stop using the `break` keyword. It is less common than `for` and `while`, but occasionally useful when the stopping condition needs to be checked in the middle of the loop body rather than at the very start.

```r
count <- 1
repeat {
  print(count)
  count <- count + 1
  if (count > 5) {
    break
  }
}
```

## ⛔ break and next

These two keywords give you finer control inside any loop.

```r
for (i in 1:10) {
  if (i == 5) {
    break     # immediately exits the loop entirely, skipping the rest
  }
  print(i)
}
# prints 1, 2, 3, 4, then stops

for (i in 1:10) {
  if (i %% 2 == 0) {
    next      # skips just this one iteration and moves to the next
  }
  print(i)
}
# prints only the odd numbers: 1, 3, 5, 7, 9
```

> [!tip] break stops the loop, next skips one iteration
> A simple way to remember the difference is that `break` is like leaving the building entirely, while `next` is like skipping ahead to the next item on a checklist without leaving.

## 🔎 switch: a cleaner alternative to long if/else chains

When you have many possible values to check against a single variable, `switch()` is often more readable than a long chain of `else if` statements.

```r
day_type <- function(day) {
  switch(day,
    "Sat" = "Weekend",
    "Sun" = "Weekend",
    "Weekday"   # this final unnamed value acts as the default/fallback case
  )
}

day_type("Sat")   # "Weekend"
day_type("Tue")   # "Weekday", falls through to the default
```

> [!note] switch also works with numbers
> When the value passed to `switch()` is a number instead of text, it works differently, selecting an option based purely on its position rather than matching a name. This numeric form is used less often and can be confusing, so it is usually clearer to stick to the named, character based form shown above.

## 🔗 Where to go next

With decision making and repetition covered, the next natural step is packaging reusable logic into your own functions. Continue to [[R Functions]], and once you are comfortable there, revisit this note's loops with fresh eyes after reading [[R Apply Family]], which often replaces a `for` loop with a single cleaner line of vectorized code.
