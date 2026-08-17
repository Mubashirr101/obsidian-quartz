---
title: Seaborn Categorical Plots
tags: [seaborn, python, boxplot, violinplot, barplot, categorical, cheatsheet]
aliases: [Seaborn boxplot, Seaborn violinplot, Seaborn barplot]
status: evergreen
---

# Seaborn Categorical Plots

One categorical variable vs one numeric variable (or just categories).

## 📊 barplot — mean + confidence interval per category

```python
sns.barplot(data=df, x="day", y="total_bill")                    # bar height = mean by default
sns.barplot(data=df, x="day", y="total_bill", hue="sex")            # grouped bars
sns.barplot(data=df, x="day", y="total_bill", estimator="median")      # change aggregation
sns.barplot(data=df, x="day", y="total_bill", errorbar=None)              # no error bars
```
> [!warning] `barplot` aggregates (mean by default) — it does NOT show raw data counts. For counts, use `countplot`.

## 🔢 countplot — count of rows per category

```python
sns.countplot(data=df, x="day")
sns.countplot(data=df, x="day", hue="sex")
```

## 📦 boxplot

```python
sns.boxplot(data=df, x="day", y="total_bill")
sns.boxplot(data=df, x="day", y="total_bill", hue="sex")
sns.boxplot(data=df, y="total_bill")            # single box, no category
```
Shows median, IQR (box), whiskers, outliers (dots).

## 🎻 violinplot — box plot + KDE shape

```python
sns.violinplot(data=df, x="day", y="total_bill")
sns.violinplot(data=df, x="day", y="total_bill", hue="sex")
sns.violinplot(data=df, x="day", y="total_bill", hue="sex", split=True)   # split violin, one half per hue value
```
> [!tip] `split=True` only makes sense with exactly 2 hue categories — shows both distributions on one violin instead of two side-by-side.

## 🔵 stripplot — raw points, jittered

```python
sns.stripplot(data=df, x="day", y="total_bill")
sns.stripplot(data=df, x="day", y="total_bill", hue="sex", dodge=True)
sns.stripplot(data=df, x="day", y="total_bill", jitter=0.2)
```

## 🐝 swarmplot — raw points, non-overlapping

```python
sns.swarmplot(data=df, x="day", y="total_bill")
```
> [!warning] `swarmplot` doesn't scale to large datasets (thousands of points) — points get squeezed and rendering slows down. Use `stripplot` or a violin/box plot instead for big data.

## 🧩 Combining points on top of a box/violin

```python
sns.boxplot(data=df, x="day", y="total_bill", color="lightgray")
sns.stripplot(data=df, x="day", y="total_bill", color="black", alpha=0.5, jitter=True)
```
> [!tip] Layering raw points over a summary plot (box/violin) gives both the statistical summary AND the actual data density — a very common, genuinely useful combo.

## 🎯 catplot — figure-level wrapper

```python
sns.catplot(data=df, x="day", y="total_bill", kind="box")
sns.catplot(data=df, x="day", y="total_bill", kind="bar", col="sex")     # facet by category
sns.catplot(data=df, x="day", y="total_bill", kind="violin", hue="sex")
```

| `kind=` | Same as |
|---|---|
| `"strip"` (default) | stripplot |
| `"swarm"` | swarmplot |
| `"box"` | boxplot |
| `"violin"` | violinplot |
| `"bar"` | barplot |
| `"count"` | countplot |
| `"point"` | pointplot |

## 🔗 Next

[[Seaborn Regression Plots]] · [[Seaborn Statistical Estimation & Data Handling]]
