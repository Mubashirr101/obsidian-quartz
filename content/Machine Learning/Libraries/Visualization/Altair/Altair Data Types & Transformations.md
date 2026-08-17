---
title: Altair Data Types & Transformations
tags: [altair, python, data-types, aggregate, bin, transform, cheatsheet]
aliases: [Altair Quantitative Nominal Ordinal Temporal, Altair transform_filter]
status: evergreen
---

# Altair Data Types & Transformations

## 🔤 The four core data types

```python
"column:Q"    # Quantitative — numeric, continuous
"column:N"       # Nominal — categories, no order
"column:O"          # Ordinal — categories, WITH order
"column:T"             # Temporal — dates/times
```

| Shorthand | Full name | Example |
|---|---|---|
| `:Q` | Quantitative | price, temperature, count |
| `:N` | Nominal | color, city name, category |
| `:O` | Ordinal | rating (low/medium/high), grade |
| `:T` | Temporal | date, timestamp |

```python
alt.X("category", type="nominal")   # explicit long form, same as "category:N"
```

> [!warning] Wrong type = wrong chart. `:O` (ordinal) on a category sorts it in the given order; `:N` (nominal) sorts alphabetically by default. `:Q` on something that's really a category produces a nonsensical continuous axis.

## 🗓️ Temporal formatting

```python
alt.X("date:T", timeUnit="month")          # aggregate/bin by month
alt.X("date:T", timeUnit="yearmonth")         # year + month
alt.X("date:T", axis=alt.Axis(format="%b %Y"))   # custom date format on the axis
```

## 📊 Aggregation

```python
alt.Chart(df).mark_bar().encode(
    x="category:N",
    y="mean(value):Q"          # aggregate inline via string shorthand
)
```
```python
alt.Y("value:Q", aggregate="mean")     # explicit form, same result
```

| Aggregate | Meaning |
|---|---|
| `mean`, `median` | average / middle value |
| `sum` | total |
| `count` | number of rows |
| `min`, `max` | extremes |
| `stdev`, `variance` | spread |
| `distinct` | unique value count |

```python
alt.Chart(df).mark_bar().encode(x="category:N", y="count():Q")   # count() needs no field name
```

## 📦 Binning (histograms)

```python
alt.Chart(df).mark_bar().encode(
    x=alt.X("value:Q", bin=True),
    y="count():Q"
)
alt.X("value:Q", bin=alt.Bin(maxbins=30))      # control bin count
```

## 🔍 Filtering

```python
alt.Chart(df).mark_bar().transform_filter(
    "datum.value > 100"
).encode(x="category:N", y="value:Q")

alt.Chart(df).mark_bar().transform_filter(
    alt.FieldGTPredicate(field="value", gt=100)   # equivalent, object form
).encode(x="category:N", y="value:Q")
```
> [!note] `datum` refers to a single data row inside a transform expression — Vega-Lite's own JS-like expression syntax, not Python.

## ➕ Calculated fields

```python
alt.Chart(df).transform_calculate(
    profit_margin="datum.profit / datum.revenue"
).mark_point().encode(x="revenue:Q", y="profit_margin:Q")
```

## 🔽 Sorting

```python
alt.X("category:N", sort="-y")               # sort x-axis by descending y value
alt.X("category:N", sort=["C","A","B"])          # explicit custom order
alt.Y("category:N", sort=alt.EncodingSortField(field="value", order="descending"))
```

## 🪟 Windowing (running totals, ranks)

```python
alt.Chart(df).transform_window(
    cumulative_total="sum(value)",
    sort=[{"field": "date"}]
).mark_line().encode(x="date:T", y="cumulative_total:Q")
```

## 🔗 Next

[[Altair Interactivity]] · [[Altair Marks & Encodings]]
