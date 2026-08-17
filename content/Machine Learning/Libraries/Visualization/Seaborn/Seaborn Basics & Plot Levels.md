---
title: Seaborn Basics & Plot Levels
tags: [seaborn, python, basics, cheatsheet]
aliases: [Seaborn Figure-level, Seaborn Axes-level]
status: evergreen
---

# Seaborn Basics & Plot Levels

## 📦 Install + import convention

```bash
pip install seaborn
```
```python
import seaborn as sns
import matplotlib.pyplot as plt
```

## 🧱 Two kinds of plotting functions

| Level | Returns | Can combine with subplots? | Examples |
|---|---|---|---|
| Axes-level | a single `Axes` | Yes, pass `ax=` | `scatterplot`, `lineplot`, `barplot`, `boxplot`, `histplot`, `heatmap` |
| Figure-level | a whole `Figure`, manages its own subplots | No, has its own `col=`/`row=` faceting instead | `relplot`, `catplot`, `displot`, `lmplot`, `pairplot`, `jointplot` |

```python
# Axes-level: fits into an existing subplot grid
fig, axs = plt.subplots(1, 2)
sns.scatterplot(data=df, x="x", y="y", ax=axs[0])
sns.boxplot(data=df, x="cat", y="y", ax=axs[1])
```

```python
# Figure-level: creates its own figure, use col=/row= for faceting instead of manual subplots
sns.relplot(data=df, x="x", y="y", col="category", kind="scatter")
```

> [!warning] Figure-level functions don't take `ax=`. If you need one plot inside an existing subplot grid, use the axes-level equivalent (`relplot` → `scatterplot`/`lineplot`, `catplot` → `barplot`/`boxplot`/etc, `displot` → `histplot`/`kdeplot`).

> [!tip] Figure-level = fastest way to facet by a category. Axes-level = needed for precise control or embedding in a custom subplot layout.

## 📊 Built-in sample datasets

```python
sns.get_dataset_names()          # list available sample datasets
df = sns.load_dataset("tips")       # load one — great for testing/practice
df = sns.load_dataset("iris")
df = sns.load_dataset("titanic")
```

## 🧮 The core call shape

```python
sns.scatterplot(data=df, x="col1", y="col2", hue="col3", size="col4", style="col5")
```
| Param | Role |
|---|---|
| `data=` | the DataFrame |
| `x=`, `y=` | column names (strings), not raw arrays |
| `hue=` | color by category |
| `size=` | point/line size by value |
| `style=` | marker/linestyle by category |

> [!tip] Always pass column names as strings + `data=df`, not `df["col"]` directly — this is what lets Seaborn auto-generate legends and labels correctly.

## 👁️ Display

```python
plt.show()          # same as matplotlib, still required in scripts
```

## 🔗 Next

[[Seaborn Relational Plots]] · [[Seaborn Statistical Estimation & Data Handling]]
