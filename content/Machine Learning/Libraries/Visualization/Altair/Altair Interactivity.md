---
title: Altair Interactivity
tags: [altair, python, interactivity, selection, tooltip, cheatsheet]
aliases: [Altair selection_point, Altair selection_interval, Altair params]
status: evergreen
---

# Altair Interactivity

Altair's biggest differentiator: charts are interactive by default in a browser/Jupyter, and that interactivity is genuinely built into the spec, not bolted on.

## 🖱️ Basic built-in interactivity

```python
alt.Chart(df).mark_point().encode(x="a", y="b").interactive()   # enables pan + zoom, one call
```

## 💬 Tooltips

```python
alt.Chart(df).mark_point().encode(
    x="a", y="b",
    tooltip=["a", "b", "category"]
)
alt.Chart(df).mark_point().encode(
    tooltip=[alt.Tooltip("value:Q", format=".2f", title="Value")]   # formatted tooltip
)
```

## 🎯 Selections (params) — the core interactivity mechanism

Modern Altair (5.x) uses `alt.selection_point()` / `alt.selection_interval()` + `.add_params()`.

```python
brush = alt.selection_interval()      # drag-select a rectangular region

alt.Chart(df).mark_point().encode(
    x="a", y="b",
    color=alt.condition(brush, "category:N", alt.value("lightgray"))   # highlight selected points
).add_params(brush)
```

```python
click = alt.selection_point(fields=["category"])      # click to select a category

alt.Chart(df).mark_bar().encode(
    x="category:N", y="value:Q",
    opacity=alt.condition(click, alt.value(1), alt.value(0.3))
).add_params(click)
```

| Selection type | Interaction |
|---|---|
| `selection_point()` | click a mark to select it |
| `selection_point(fields=["col"])` | click selects every mark sharing that field's value |
| `selection_interval()` | drag a rectangular region (brush) |
| `selection_interval(encodings=["x"])` | brush limited to one axis |

## 🎨 alt.condition — the "if selected, then" pattern

```python
color=alt.condition(selection, "category:N", alt.value("lightgray"))
```
Reads as: if a mark is part of `selection`, color it by category; otherwise, gray it out.

> [!tip] `alt.condition(predicate, if_true, if_false)` is the single most important interactivity pattern in Altair — nearly every "highlight on click/hover" chart uses this exact shape.

## 🔗 Cross-filtering between two charts

```python
brush = alt.selection_interval()

points = alt.Chart(df).mark_point().encode(
    x="a:Q", y="b:Q",
    color=alt.condition(brush, "category:N", alt.value("lightgray"))
).add_params(brush)

bars = alt.Chart(df).mark_bar().encode(
    x="category:N",
    y="count():Q"
).transform_filter(brush)      # bars update to reflect only the brushed selection

points | bars      # side-by-side, linked
```
> [!note] Linking works because `brush` is a shared parameter — `add_params()` on one chart, `transform_filter()` on the other, referencing the same object.

## 🖱️ Hover-based selection

```python
hover = alt.selection_point(on="mouseover", fields=["category"], nearest=True)

alt.Chart(df).mark_point().encode(
    x="a", y="b",
    size=alt.condition(hover, alt.value(200), alt.value(50))
).add_params(hover)
```

## 🎚️ Interactive parameter (e.g. a slider)

```python
slider = alt.binding_range(min=0, max=100, step=1, name="Threshold ")
param = alt.param(bind=slider, value=50)

alt.Chart(df).mark_point().add_params(param).transform_filter(
    alt.datum.value > param
).encode(x="a", y="b")
```

## 🔗 Next

[[Altair Composition & Layouts]] · [[Altair Styling & Themes]]
