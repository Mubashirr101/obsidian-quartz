---
title: Altair Composition & Layouts
tags: [altair, python, layer, facet, concat, composition, cheatsheet]
aliases: [Altair layer, Altair facet, Altair hconcat, Altair repeat]
status: evergreen
---

# Altair Composition & Layouts

Altair charts are objects — combine them with operators or explicit functions.

## 🧱 Layering — overlay charts on the same axes

```python
line = alt.Chart(df).mark_line().encode(x="date:T", y="value:Q")
points = alt.Chart(df).mark_point().encode(x="date:T", y="value:Q")

line + points                    # shorthand operator
alt.layer(line, points)             # equivalent, explicit form
```
> [!tip] Layered charts must share compatible encodings (same x/y fields) — Altair merges them onto one shared axes.

### Common layer pattern: trend line + rule (e.g. average line)

```python
bars = alt.Chart(df).mark_bar().encode(x="category:N", y="value:Q")
rule = alt.Chart(df).mark_rule(color="red").encode(y="mean(value):Q")

bars + rule
```

## 🔳 Faceting — small multiples, one chart type repeated per category

```python
alt.Chart(df).mark_point().encode(
    x="a:Q", y="b:Q"
).facet(column="category:N")

alt.Chart(df).mark_point().encode(
    x="a:Q", y="b:Q"
).facet(row="group:N", column="category:N")
```
```python
alt.Chart(df).mark_point().encode(
    x="a:Q", y="b:Q",
    column="category:N"      # shorthand, same effect as .facet(column=...) for simple cases
)
```

## ↔️ hconcat / vconcat — side by side, different chart types

```python
chart1 = alt.Chart(df).mark_bar().encode(x="a", y="b")
chart2 = alt.Chart(df).mark_line().encode(x="c", y="d")

chart1 | chart2         # horizontal, shorthand for alt.hconcat(chart1, chart2)
chart1 & chart2            # vertical, shorthand for alt.vconcat(chart1, chart2)
```
> [!tip] Use `facet` when it's the SAME chart repeated per category. Use `hconcat`/`vconcat` when the charts are genuinely different (different marks, different data, unrelated axes).

### Mixed grid

```python
(chart1 | chart2) & chart3      # 2 charts on top, 1 below spanning both
```

## 🔁 repeat — same chart spec across multiple fields

```python
alt.Chart(df).mark_point().encode(
    x=alt.X(alt.repeat("column"), type="quantitative"),
    y=alt.Y(alt.repeat("row"), type="quantitative")
).properties(width=150, height=150).repeat(
    row=["a", "b", "c"],
    column=["a", "b", "c"]
)
```
> [!note] This is Altair's equivalent to a Seaborn `pairplot` — a scatterplot matrix built via `repeat()` rather than a dedicated function.

## 🎯 Interactive selections across composed charts

```python
brush = alt.selection_interval()

scatter = alt.Chart(df).mark_point().encode(
    x="a", y="b",
    color=alt.condition(brush, "category:N", alt.value("gray"))
).add_params(brush)

hist = alt.Chart(df).mark_bar().encode(
    x="category:N", y="count():Q"
).transform_filter(brush)

scatter & hist      # stacked, linked via the shared brush param
```
See [[Altair Interactivity]] for the full selection mechanics.

## 🔗 Next

[[Altair Styling & Themes]] · [[Altair Saving & Exporting]]
