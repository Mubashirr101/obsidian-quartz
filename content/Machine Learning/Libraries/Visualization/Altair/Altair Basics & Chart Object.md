---
title: Altair Basics & Chart Object
tags: [altair, python, chart, basics, cheatsheet]
aliases: [Altair Chart Object]
status: evergreen
---

# Altair Basics & Chart Object

## 📦 Install

```bash
pip install altair vega_datasets
```
```python
import altair as alt
import pandas as pd
from vega_datasets import data      # built-in sample datasets
```

## 🧱 The core pattern

```python
alt.Chart(df).mark_point().encode(
    x="col1",
    y="col2"
)
```

| Piece | Role |
|---|---|
| `Chart(df)` | wraps a pandas DataFrame |
| `.mark_X()` | how to draw each row — point, bar, line, etc. |
| `.encode(...)` | which columns map to which visual channels (x, y, color...) |

> [!tip] Nothing renders until `.encode()` is called — `mark_point()` alone just sets the shape, `encode()` is what actually connects data to the chart.

## 📊 Sample datasets

```python
df = data.cars()
df = data.iris()
df = data.stocks()
```

## 👁️ Displaying a chart

```python
chart = alt.Chart(df).mark_bar().encode(x="a", y="b")
chart                    # Jupyter: auto-displays last expression in a cell
chart.show()                 # opens in browser, works outside Jupyter too
```

## 🔤 Shorthand vs explicit encoding

```python
# shorthand — column name as a plain string, Altair infers the type
alt.Chart(df).mark_bar().encode(x="category", y="value")

# explicit — wrap in alt.X()/alt.Y() for full control
alt.Chart(df).mark_bar().encode(
    x=alt.X("category", type="nominal", title="Category"),
    y=alt.Y("value", type="quantitative", title="Value")
)
```
> [!tip] Start with shorthand strings for speed. Switch to `alt.X(...)`/`alt.Y(...)` the moment you need to set a title, sort order, scale, or explicit type. See [[Altair Data Types & Transformations]] for the type shorthand codes (`:Q`, `:N`, etc).

## 🔗 Type shorthand suffix

```python
alt.Chart(df).mark_bar().encode(
    x="category:N",     # nominal
    y="value:Q"             # quantitative
)
```
Covered fully in [[Altair Data Types & Transformations]].

## 📐 Chart size

```python
alt.Chart(df).mark_point().encode(x="a", y="b").properties(width=400, height=300)
```

## 🏷️ Title

```python
alt.Chart(df).mark_bar().encode(x="a", y="b").properties(title="My Chart")
alt.Chart(df).mark_bar().encode(x="a", y="b").properties(
    title=alt.TitleParams("My Chart", subtitle="A subtitle here")
)
```

## 🔗 Next

[[Altair Marks & Encodings]] · [[Altair Data Types & Transformations]]
