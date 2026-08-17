---
title: Seaborn
tags: [seaborn, python, data-visualization, moc, index, cheatsheet]
aliases: [Seaborn Cheatsheet]
status: evergreen
---

# Seaborn

## 🧠 What is Seaborn

Statistical plotting library built directly on top of Matplotlib. Works natively with Pandas DataFrames, adds sensible defaults, and handles a lot of statistical aggregation (means, confidence intervals, regression lines) automatically.

| | Matplotlib | Seaborn |
|---|---|---|
| Input | Raw arrays | DataFrames + column names (`data=`, `x=`, `y=`) |
| Statistics | Manual | Built-in (aggregation, CI, regression) |
| Defaults | Minimal | Polished out of the box |
| Control | Full, low-level | High-level, less fine-grained (drop to matplotlib `ax` for that) |

> [!tip] Seaborn plots return a matplotlib `Axes` (or `Figure` for grid functions) — use `ax.set_...()` / `plt.` calls on top for anything Seaborn doesn't expose directly. See [[Matplotlib]] for those.

## 📚 Map of Content

- [[Seaborn Basics & Plot Levels]] - figure-level vs axes-level functions, install, first plot
- [[Seaborn Relational Plots]] - scatterplot, lineplot, relplot
- [[Seaborn Distribution Plots]] - histplot, kdeplot, ecdfplot, displot
- [[Seaborn Categorical Plots]] - bar, box, violin, strip, swarm, count, catplot
- [[Seaborn Regression Plots]] - regplot, lmplot, residplot
- [[Seaborn Matrix & Heatmaps]] - heatmap, clustermap
- [[Seaborn Multi-Plot Grids]] - FacetGrid, PairGrid, pairplot, jointplot
- [[Seaborn Styling & Themes]] - themes, palettes, context
- [[Seaborn Statistical Estimation & Data Handling]] - hue/size/style semantics, CI, long vs wide data

## ⚡ Minimal example

```python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset("tips")          # built-in sample datasets
sns.scatterplot(data=df, x="total_bill", y="tip", hue="time")
plt.show()
```

```bash
pip install seaborn
```
