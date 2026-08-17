---
title: Seaborn Distribution Plots
tags: [seaborn, python, histplot, kdeplot, distribution, cheatsheet]
aliases: [Seaborn histplot, Seaborn kdeplot]
status: evergreen
---

# Seaborn Distribution Plots

How is a variable distributed?

## 📊 histplot

```python
sns.histplot(data=df, x="total_bill")
sns.histplot(data=df, x="total_bill", bins=30)
sns.histplot(data=df, x="total_bill", hue="time")                        # overlaid histograms by category
sns.histplot(data=df, x="total_bill", hue="time", multiple="stack")         # stacked instead of overlaid
sns.histplot(data=df, x="total_bill", kde=True)                                # add a KDE curve on top
sns.histplot(data=df, x="total_bill", stat="density")                             # normalize to density instead of count
```

| `multiple=` | Effect (with `hue`) |
|---|---|
| `"layer"` (default) | overlapping, semi-transparent |
| `"stack"` | stacked bars |
| `"dodge"` | side-by-side bars |
| `"fill"` | stacked, normalized to 100% |

## 🌊 kdeplot — smoothed density curve

```python
sns.kdeplot(data=df, x="total_bill")
sns.kdeplot(data=df, x="total_bill", hue="time")
sns.kdeplot(data=df, x="total_bill", hue="time", fill=True)         # shaded area under curve
sns.kdeplot(data=df, x="total_bill", y="tip")                          # 2D density (contour plot)
```

> [!tip] KDE = smoothed histogram. Good for comparing shapes of distributions across groups without bin-width artifacts.

## 📶 ecdfplot — cumulative distribution

```python
sns.ecdfplot(data=df, x="total_bill")
sns.ecdfplot(data=df, x="total_bill", hue="time")
```
> [!tip] ECDF shows "what % of data is ≤ x" — no binning choices needed, often clearer than a histogram for comparing distributions.

## 📏 rugplot — raw data ticks along an axis

```python
sns.rugplot(data=df, x="total_bill")
sns.histplot(data=df, x="total_bill")
sns.rugplot(data=df, x="total_bill")     # combine: histogram + individual data point ticks
```

## 🎯 displot — figure-level wrapper

```python
sns.displot(data=df, x="total_bill", kind="hist")
sns.displot(data=df, x="total_bill", kind="kde")
sns.displot(data=df, x="total_bill", kind="ecdf")

sns.displot(data=df, x="total_bill", col="time", kind="hist")      # facet by category
```

## 🧮 Choosing which one

| Question | Use |
|---|---|
| Shape + counts, simple | `histplot` |
| Smooth shape comparison across groups | `kdeplot` |
| "What fraction is below X" | `ecdfplot` |
| Faceted grid of distributions | `displot` |

## 🔗 Next

[[Seaborn Categorical Plots]] · [[Seaborn Multi-Plot Grids]]
