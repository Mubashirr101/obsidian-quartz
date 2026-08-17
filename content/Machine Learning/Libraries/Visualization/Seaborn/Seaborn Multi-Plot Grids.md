---
title: Seaborn Multi-Plot Grids
tags: [seaborn, python, facetgrid, pairplot, jointplot, cheatsheet]
aliases: [Seaborn FacetGrid, Seaborn pairplot, Seaborn jointplot]
status: evergreen
---

# Seaborn Multi-Plot Grids

## 🔲 pairplot — every variable vs every other

```python
sns.pairplot(df)                                  # all numeric columns, scatter + histogram on diagonal
sns.pairplot(df, hue="species")                       # color by category
sns.pairplot(df, vars=["col1", "col2", "col3"])          # limit to specific columns
sns.pairplot(df, diag_kind="kde")                           # KDE instead of histogram on the diagonal
sns.pairplot(df, kind="reg")                                   # regression line in off-diagonal cells
sns.pairplot(df, corner=True)                                      # only lower triangle (skip redundant mirror)
```
> [!tip] `pairplot` is usually the fastest first step in exploratory analysis — one call reveals every pairwise relationship + each variable's distribution at once.

## 🎯 jointplot — two variables + their individual distributions

```python
sns.jointplot(data=df, x="total_bill", y="tip")
sns.jointplot(data=df, x="total_bill", y="tip", kind="scatter")      # default
sns.jointplot(data=df, x="total_bill", y="tip", kind="hex")             # hexbin, good for dense data
sns.jointplot(data=df, x="total_bill", y="tip", kind="kde")                # 2D density
sns.jointplot(data=df, x="total_bill", y="tip", kind="reg")                   # scatter + regression line
sns.jointplot(data=df, x="total_bill", y="tip", hue="time")                      # color by category
```
Shows a central scatter/density plot + marginal histograms on the top and right edges.

## 🧩 FacetGrid — manual, flexible faceting

```python
g = sns.FacetGrid(df, col="time", row="sex", hue="smoker")
g.map(sns.scatterplot, "total_bill", "tip")
g.add_legend()
```

```python
g = sns.FacetGrid(df, col="day", col_wrap=2, height=3)
g.map_dataframe(sns.histplot, x="total_bill")      # map_dataframe passes the actual sub-DataFrame, not raw arrays
```

> [!tip] Reach for `FacetGrid` directly when a figure-level function (`relplot`/`catplot`/`displot`) doesn't support the exact plot type you need — those are actually built on top of `FacetGrid` internally.

| Method | Passes to the plotting function |
|---|---|
| `.map(func, "x", "y")` | positional arrays |
| `.map_dataframe(func, x="x", y="y")` | keyword args + the facet's own sub-DataFrame |

## 🔗 PairGrid — manual version of pairplot

```python
g = sns.PairGrid(df, hue="species")
g.map_diag(sns.histplot)
g.map_offdiag(sns.scatterplot)
g.add_legend()
```
```python
g = sns.PairGrid(df)
g.map_upper(sns.scatterplot)
g.map_lower(sns.kdeplot)
g.map_diag(sns.histplot)
```
> [!tip] `PairGrid` lets you use a DIFFERENT plot type for upper triangle, lower triangle, and diagonal — `pairplot` can't do that mix in one call.

## 🎯 JointGrid — manual version of jointplot

```python
g = sns.JointGrid(data=df, x="total_bill", y="tip")
g.plot(sns.scatterplot, sns.histplot)
```

## 🔗 Next

[[Seaborn Styling & Themes]] · [[Seaborn Statistical Estimation & Data Handling]]
