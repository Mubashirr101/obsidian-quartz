---
title: 🏛️ R Object Oriented Programming
tags: [r, programming, oop, s3, s4, r6, classes]
aliases: [R OOP, R S3, R S4, R6]
status: evergreen
---

# 🏛️ R Object Oriented Programming

## 🧠 What this note covers

Object oriented programming, often shortened to OOP, is a way of organizing code around "objects," which bundle data together with functions that operate on that data. What makes R unusual is that it does not have just one single OOP system, it has several, developed at different points in the language's history, each with different tradeoffs. This note covers the three most commonly encountered systems: S3, S4, and R6.

## 🥇 S3: the simple, informal system

S3 is the oldest and by far the most widely used OOP system in R, precisely because of how lightweight and informal it is. An S3 object is really just a regular list (or another structure) with a special "class" attribute attached to it, and functions behave differently depending on what that class attribute says.

```r
# Creating an S3 object is as simple as attaching a class attribute
create_student <- function(name, score) {
  student <- list(name = name, score = score)
  class(student) <- "student"
  return(student)
}

amit <- create_student("Amit", 88)
class(amit)   # "student"
```

### Generic functions and methods

The real power of S3 comes from "generic functions," which look at an object's class and automatically dispatch to the correct specialized version of a function, called a "method."

```r
print.student <- function(x, ...) {
  cat("Student:", x$name, "- Score:", x$score, "\n")
}

print(amit)
# Student: Amit - Score: 88
```

> [!note] How dispatch actually works
> When you call `print(amit)`, R notices that `amit` has the class `"student"`, and looks for a function specifically named `print.student`. If it finds one, that specialized version runs instead of the generic default. This naming convention, `functionname.classname`, is the entire mechanism behind S3, and it is exactly why functions like `print()`, `summary()`, and `plot()` behave completely differently depending on what kind of object you feed into them.

> [!tip] Familiar functions you already use are S3 generics
> Many of the base R functions you have already been using throughout this vault, such as `print()`, `summary()`, and even the `+` operator, are themselves S3 generics under the hood. This is why `summary()` shows something completely different for a data frame compared to a linear regression model object, without you ever needing to specify which version to use.

> [!warning] S3 has no built in safety checks
> Because S3 is so informal, R does absolutely nothing to enforce that a `"student"` object actually contains a `name` and `score` field. Nothing stops you from attaching the `"student"` class attribute to a completely unrelated object with the wrong internal structure, which can cause confusing errors far away from where the actual mistake happened. This lack of enforcement is exactly the gap that S4 was designed to fill.

## 🥈 S4: a stricter, more formal system

S4 is a more rigorous OOP system, requiring you to formally define a class's structure in advance, including the names and expected types of its fields, which are called "slots" in S4 terminology.

```r
setClass("Student", representation(
  name = "character",
  score = "numeric"
))

amit <- new("Student", name = "Amit", score = 88)
amit@name    # "Amit", the @ symbol accesses a slot in S4, similar to $ in a list
```

> [!note] Why the strictness can be worth the extra effort
> Because S4 enforces types up front, trying to create `new("Student", name = "Amit", score = "eighty-eight")` would immediately throw a clear error, since score was declared as numeric, not character. This early, precise error is much easier to debug than a vague, confusing failure that might otherwise occur much later in an S3 based script.

### Defining S4 methods

```r
setGeneric("describe", function(x) standardGeneric("describe"))

setMethod("describe", "Student", function(x) {
  cat(x@name, "scored", x@score, "\n")
})

describe(amit)
# Amit scored 88
```

> [!tip] Where S4 is still commonly seen today
> S4 is used less often in everyday data analysis scripts than S3, but it remains heavily used in certain specialized, foundational packages, most notably Bioconductor, the major ecosystem of R packages for genomics and bioinformatics research, where the extra rigor around data structure genuinely matters.

## 🥉 R6: reference class style OOP

R6, provided by the R6 package rather than base R itself, brings a style of OOP that will feel much more immediately familiar to programmers coming from languages like Python or Java. The key structural difference from S3 and S4 is that R6 objects use "reference semantics," meaning that modifying an R6 object actually changes it directly, in place, rather than creating a separate modified copy, which is how S3, S4, and ordinary R objects normally behave.

```r
library(R6)

Student <- R6Class("Student",
  public = list(
    name = NULL,
    score = NULL,
    initialize = function(name, score) {
      self$name <- name
      self$score <- score
    },
    describe = function() {
      cat(self$name, "scored", self$score, "\n")
    }
  )
)

amit <- Student$new("Amit", 88)
amit$describe()
# Amit scored 88

amit$score <- 95   # this modifies the object directly, in place
```

> [!warning] Reference semantics is a genuine behavioral difference, not just style
> This "in place" modification behavior is a real and important departure from how almost everything else in R normally works. Ordinarily in R, if you pass a data frame or list into a function and modify it inside that function, the original object outside the function remains completely untouched, because R copies the object first. R6 objects break this pattern intentionally, which is powerful for certain use cases, such as building simulations or applications with genuinely shared, mutable state, but it also means R6 objects need to be used more carefully and deliberately.

## 🧮 Quick comparison table

| System | Formality | Type checking | Modification behavior | Common use case |
|---|---|---|---|---|
| S3 | Very informal | None | Copies on modification | Everyday scripts, most base R functions |
| S4 | Formal | Strict, enforced | Copies on modification | Bioconductor, packages needing rigor |
| R6 | Formal | Optional | Modifies in place (reference) | Simulations, apps, shared mutable state |

> [!tip] Which one should you actually learn first
> For the vast majority of everyday data analysis work, you will primarily be a "consumer" of S3 objects created by other packages, such as the results of a linear model, rather than someone regularly writing brand new S3, S4, or R6 classes from scratch. Understanding how S3 dispatch works, since it underlies so much of base R's behavior, is by far the most broadly useful of the three to genuinely understand well.

## 🔗 Where to go next

With OOP covered, you have now seen the major structural ideas behind how R itself is built. Circle back to [[R Functions]] to see how generic functions relate to ordinary functions, or explore [[R Error Handling & Debugging]] to learn how to gracefully handle situations where an object does not behave the way your code expects.
