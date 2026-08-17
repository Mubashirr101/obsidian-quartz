---
title: Seaborn Matrix & Heatmaps
tags: [seaborn, python, heatmap, clustermap, correlation, cheatsheet]
aliases: [Seaborn heatmap, Seaborn clustermap]
status: evergreen
---

# Seaborn Matrix & Heatmaps

## 🌡️ heatmap

```python
sns.heatmap(matrix)
sns.heatmap(matrix, annot=True)                      # show values as text in each cell
sns.heatmap(matrix, annot=True, fmt=".2f")               # format annotation numbers
sns.heatmap(matrix, cmap="coolwarm")                         # colormap
sns.heatmap(matrix, cmap="coolwarm", center=0)                  # diverging, centered at 0
sns.heatmap(matrix, vmin=0, vmax=100)                               # fix color scale range
sns.heatmap(matrix, cbar=False)                                        # hide the colorbar
sns.heatmap(matrix, linewidths=0.5, linecolor="white")                    # cell borders
```

## 🔗 Correlation matrix (the most common heatmap use case)

```python
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap="coolwarm", center=0, fmt=".2f")
```

```python
import numpy as np
mask = np.triu(np.ones_like(corr, dtype=bool))       # mask upper triangle — avoid redundant mirrored info
sns.heatmap(corr, mask=mask, annot=True, cmap="coolwarm", center=0)
```
> [!tip] Correlation matrices are symmetric — masking the upper triangle removes visual clutter without losing information.

## 🌳 clustermap — heatmap + hierarchical clustering

```python
sns.clustermap(matrix)
sns.clustermap(matrix, cmap="viridis", standard_scale=1)      # standardize columns before clustering
sns.clustermap(matrix, method="average", metric="euclidean")     # clustering algorithm + distance metric
sns.clustermap(matrix, row_cluster=False)                            # cluster only columns, not rows
```
> [!note] `clustermap` reorders rows/columns to group similar ones together (via dendrograms on the sides) — reveals structure a plain `heatmap` won't show, since plain heatmap keeps original row/column order.

> [!warning] `clustermap` is figure-level and manages its own layout entirely — doesn't accept `ax=`, can't be combined into a subplot grid.

## 🧮 Pivoting data into matrix shape first

```python
pivot = df.pivot_table(index="day", columns="time", values="total_bill", aggfunc="mean")
sns.heatmap(pivot, annot=True, fmt=".1f")
```
> [!tip] `heatmap` expects a 2D matrix (rows × columns of numbers) — long-format DataFrames usually need `pivot_table()` first.

## 🔗 Next

[[Seaborn Multi-Plot Grids]] · [[Seaborn Styling & Themes]]
