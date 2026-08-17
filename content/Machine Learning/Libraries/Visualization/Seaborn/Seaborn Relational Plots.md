---
title: Seaborn Relational Plots
tags: [seaborn, python, scatterplot, lineplot, relplot, cheatsheet]
aliases: [Seaborn scatterplot, Seaborn lineplot]
status: evergreen
---

# Seaborn Relational Plots

Relationship between two (usually numeric) variables.

## 🔵 scatterplot

```python
sns.scatterplot(data=df, x="total_bill", y="tip")
sns.scatterplot(data=df, x="total_bill", y="tip", hue="time")             # color by category
sns.scatterplot(data=df, x="total_bill", y="tip", hue="time", size="size")   # + point size by value
sns.scatterplot(data=df, x="total_bill", y="tip", style="smoker")            # marker shape by category
sns.scatterplot(data=df, x="total_bill", y="tip", palette="viridis", hue="size")   # custom colormap
```

## 📈 lineplot

```python
sns.lineplot(data=df, x="date", y="value")
sns.lineplot(data=df, x="date", y="value", hue="category")
```

> [!tip] `lineplot` auto-aggregates when multiple y-values share the same x (e.g. multiple measurements per day) — plots the mean line with a shaded confidence interval band automatically.

```python
sns.lineplot(data=df, x="date", y="value", errorbar=None)          # disable the CI band
sns.lineplot(data=df, x="date", y="value", errorbar=("ci", 95))       # explicit CI level
sns.lineplot(data=df, x="date", y="value", estimator="median")           # change the aggregation method
```

## 🎯 relplot — figure-level wrapper

```python
sns.relplot(data=df, x="total_bill", y="tip", kind="scatter")
sns.relplot(data=df, x="date", y="value", kind="line")

sns.relplot(data=df, x="total_bill", y="tip", hue="time", col="day")           # facet into columns by day
sns.relplot(data=df, x="total_bill", y="tip", hue="time", col="day", row="sex")   # facet grid, rows AND columns
```

> [!tip] `relplot` = `scatterplot`/`lineplot` + automatic faceting (`col=`/`row=`) in one call. Use it the moment you want small multiples split by a category.

## 🧮 Faceting controls

```python
sns.relplot(data=df, x="x", y="y", col="category", col_wrap=3)      # wrap columns after 3 into new rows
sns.relplot(data=df, x="x", y="y", col="category", height=4, aspect=1.2)   # per-facet size
```

## 🔗 Next

[[Seaborn Distribution Plots]] · [[Seaborn Multi-Plot Grids]]
