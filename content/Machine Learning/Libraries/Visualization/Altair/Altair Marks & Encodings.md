---
title: Altair Marks & Encodings
tags: [altair, python, marks, encoding, cheatsheet]
aliases: [Altair mark_bar, Altair mark_line, Altair encoding channels]
status: evergreen
---

# Altair Marks & Encodings

## 🎨 Mark types

```python
alt.Chart(df).mark_point()          # scatter points
alt.Chart(df).mark_circle()             # filled circles
alt.Chart(df).mark_square()                # filled squares
alt.Chart(df).mark_line()                     # line
alt.Chart(df).mark_line(point=True)              # line + visible points
alt.Chart(df).mark_bar()                            # bar chart
alt.Chart(df).mark_area()                              # filled area
alt.Chart(df).mark_rect()                                 # heatmap-style cells
alt.Chart(df).mark_arc()                                     # pie / donut
alt.Chart(df).mark_boxplot()                                    # box plot
alt.Chart(df).mark_tick()                                          # tick marks (strip plot style)
alt.Chart(df).mark_text()                                              # text labels as marks
alt.Chart(df).mark_rule()                                                  # reference lines
alt.Chart(df).mark_geoshape()                                                 # maps
```

## 🎯 Encoding channels

```python
alt.Chart(df).mark_point().encode(
    x="col1",
    y="col2",
    color="category",
    size="value",
    shape="group",
    opacity="confidence",
    tooltip=["col1", "col2", "category"]
)
```

| Channel | Maps a variable to |
|---|---|
| `x`, `y` | position |
| `color` | color |
| `size` | point/mark size |
| `shape` | marker shape (point marks only) |
| `opacity` | transparency |
| `tooltip` | hover info (list of columns) |
| `column`, `row` | small multiples — see [[Altair Composition & Layouts]] |
| `order` | draw/stacking order |
| `text` | label content (`mark_text` only) |

## 📊 Bar chart

```python
alt.Chart(df).mark_bar().encode(x="category:N", y="value:Q")
alt.Chart(df).mark_bar().encode(x="category:N", y="value:Q", color="group:N")     # grouped/stacked automatically
alt.Chart(df).mark_bar().encode(y="category:N", x="value:Q")                         # horizontal — just swap x/y
```

## 📈 Line chart

```python
alt.Chart(df).mark_line().encode(x="date:T", y="value:Q", color="category:N")
```

## 🔵 Scatter with multiple channels

```python
alt.Chart(df).mark_circle().encode(
    x="horsepower:Q",
    y="mpg:Q",
    color="origin:N",
    size="weight:Q",
    tooltip=["name", "horsepower", "mpg"]
)
```
> [!tip] `tooltip=[...]` is nearly free interactivity — always worth adding once a chart has more than 2-3 encoded variables, so hidden context is one hover away.

## 🖌️ Mark-level styling (fixed, not data-driven)

```python
alt.Chart(df).mark_bar(color="steelblue", opacity=0.8)
alt.Chart(df).mark_point(size=100, filled=True)
alt.Chart(df).mark_line(strokeWidth=3, strokeDash=[5,5])
```
> [!warning] Setting `color=` inside `mark_bar(color=...)` is a FIXED color for every mark. Setting `color=` inside `.encode(color=...)` is DATA-DRIVEN. Easy to mix these up.

## 🔗 Next

[[Altair Data Types & Transformations]] · [[Altair Interactivity]]
