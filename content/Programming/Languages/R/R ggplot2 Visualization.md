---
title: 📈 R ggplot2 Visualization
tags: [r, programming, ggplot2, visualization, charts]
aliases: [R Plotting, ggplot2, Grammar of Graphics]
status: evergreen
---

# 📈 R ggplot2 Visualization

## 🧠 What this note covers

ggplot2 is R's most widely used plotting package, and it is built around a very particular idea called the "grammar of graphics," where instead of picking a preset chart type off a shelf, you build a plot up in layers, describing your data, then describing how it should be visually represented. This note covers the core building blocks of that grammar, the most common chart types, and how to customize the finished result. It works especially well with data prepared using the tools in [[R dplyr & Tidyverse]].

## 🧱 The grammar of graphics: three essential pieces

Every ggplot2 plot needs at minimum three things: the data itself, an "aesthetic mapping" describing which columns control which visual properties, and a "geometry" describing what shape should represent each row.

```r
library(ggplot2)

ggplot(data = students, aes(x = age, y = score)) +
  geom_point()
```

Breaking this down:
- `ggplot(data = students, ...)` sets up the plot and tells it which data frame to pull from.
- `aes(x = age, y = score)` is the "aesthetic mapping," telling ggplot2 that the age column controls horizontal position and the score column controls vertical position.
- `geom_point()` is the "geometry," telling ggplot2 to represent each row as a point, producing a scatter plot.
- The plus sign `+` is how ggplot2 layers pieces on top of each other, and it is the one place in the tidyverse ecosystem where you use `+` instead of the pipe `|>`.

> [!warning] Do not confuse the ggplot + with the tidyverse pipe
> This is one of the most common early mistakes. Data wrangling steps using dplyr are chained with the pipe `|>`, but once you start building a ggplot2 plot itself, every additional layer is added using a plain `+` sign instead. Mixing these up, for example trying to pipe into `geom_point()`, will produce a confusing error.

## 🎨 Common geometries (chart types)

```r
ggplot(students, aes(x = age)) +
  geom_histogram(binwidth = 1)          # a histogram, showing the distribution of a single numeric variable

ggplot(students, aes(x = grade)) +
  geom_bar()                              # a bar chart, counting how many rows fall into each category

ggplot(students, aes(x = age, y = score)) +
  geom_point()                              # a scatter plot, showing the relationship between two numeric variables

ggplot(students, aes(x = age, y = score)) +
  geom_line()                                 # a line chart, usually best for data ordered along the x axis, like time

ggplot(students, aes(x = grade, y = score)) +
  geom_boxplot()                                # a box plot, showing the distribution of score within each grade group
```

> [!tip] Choosing the right geometry for your question
> A useful habit is to ask what kind of question you are trying to answer before picking a geometry. "How is one variable distributed" points toward `geom_histogram()` or `geom_boxplot()`. "How do two numeric variables relate" points toward `geom_point()`. "How does something change over time or an ordered sequence" points toward `geom_line()`. "How many observations fall into each category" points toward `geom_bar()`.

## 🎭 Mapping additional variables with color, size, and shape

Beyond just x and y position, you can map data columns to other visual properties too, like color, allowing a single plot to display more than two dimensions of information at once.

```r
ggplot(students, aes(x = age, y = score, color = grade)) +
  geom_point()
# each point is colored automatically based on which grade category it belongs to,
# with a legend added automatically as well
```

> [!note] Mapped aesthetics versus fixed aesthetics
> There is an important difference between putting a property inside `aes()`, which maps it to a column of data, and setting it outside `aes()`, which just fixes it to one constant value for every single point. Writing `geom_point(aes(color = grade))` colors points based on data, while writing `geom_point(color = "blue")` simply makes every single point blue, with no connection to the data at all.

## 🏷️ Labels and titles

```r
ggplot(students, aes(x = age, y = score)) +
  geom_point() +
  labs(
    title = "Student Age vs Score",
    subtitle = "A quick look at the relationship",
    x = "Age (years)",
    y = "Test Score",
    caption = "Source: Internal records"
  )
```

## 🎨 Themes: controlling the overall look

Themes control the non-data visual elements of the plot, like background color, gridlines, and font.

```r
ggplot(students, aes(x = age, y = score)) +
  geom_point() +
  theme_minimal()   # a clean, simple theme, removing the default gray background
```

> [!tip] A few popular built in themes
> `theme_minimal()` and `theme_classic()` are popular choices for a cleaner, more publication-ready look, while `theme_bw()` gives a simple black and white style with a light grid, a solid neutral default for most reports.

## 🧩 Faceting: small multiples

Faceting automatically splits your data into multiple small side by side plots, one for each category in a chosen column, which is often far more effective than trying to cram every category into a single crowded plot.

```r
ggplot(students, aes(x = age, y = score)) +
  geom_point() +
  facet_wrap(~ grade)
# creates a separate small scatter plot for each grade category, arranged in a grid
```

## 💾 Saving a plot

```r
my_plot <- ggplot(students, aes(x = age, y = score)) + geom_point()
ggsave("my_plot.png", plot = my_plot, width = 8, height = 6, dpi = 300)
```

> [!tip] ggsave remembers your last plot automatically
> If you skip the `plot` argument entirely, `ggsave()` will automatically save whichever ggplot2 plot was most recently displayed, which is convenient for quick, throwaway exports during interactive exploration, though explicitly naming the plot object is generally considered better practice in a real script.

## 🧮 A complete example, putting it all together

```r
library(ggplot2)
library(dplyr)

students |>
  filter(passed == TRUE) |>
  ggplot(aes(x = age, y = score, color = grade)) +
  geom_point(size = 3, alpha = 0.7) +
  labs(title = "Passing Students: Age vs Score", x = "Age", y = "Score") +
  theme_minimal()
```

> [!note] Piping a dplyr chain directly into ggplot
> This example shows a very common real world pattern: using the tidyverse pipe to filter and prepare your data first, and then feeding the final cleaned result directly into `ggplot()` as the very last step of the same chain, switching from `|>` to `+` right at the moment `ggplot()` begins.

## 🔗 Where to go next

With plotting covered, you now have the full core toolkit for exploring and communicating data in R. Consider revisiting [[R dplyr & Tidyverse]] to practice preparing messier real datasets for plots like these, or explore [[R Object Oriented Programming]] if you want to understand how R itself is structured under the hood.
