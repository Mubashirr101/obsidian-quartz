---
title: Matplotlib Plot Types
tags: [matplotlib, python, plot-types, cheatsheet]
aliases: [Matplotlib Charts]
status: evergreen
---

# Matplotlib Plot Types

All examples assume `fig, ax = plt.subplots()`.

## 📈 Line plot

```python
ax.plot(x, y)
ax.plot(x, y, color="red", linestyle="--", marker="o", linewidth=2, label="series 1")
ax.plot(x, y1, x, y2)          # multiple lines, one call
```

## 🔵 Scatter plot

```python
ax.scatter(x, y)
ax.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap="viridis")   # c=color values, s=marker size
```

## 📊 Bar chart

```python
ax.bar(categories, values)                # vertical
ax.barh(categories, values)                   # horizontal
ax.bar(x, values, width=0.4, color="steelblue")

# grouped bars
ax.bar(x - 0.2, values1, width=0.4, label="A")
ax.bar(x + 0.2, values2, width=0.4, label="B")

# stacked bars
ax.bar(x, values1, label="A")
ax.bar(x, values2, bottom=values1, label="B")
```

## 📉 Histogram

```python
ax.hist(data, bins=20)
ax.hist(data, bins=20, density=True, alpha=0.6, edgecolor="black")
ax.hist([data1, data2], bins=20, label=["A", "B"])   # multiple datasets
```

## 🥧 Pie chart

```python
ax.pie(sizes, labels=labels, autopct="%1.1f%%", startangle=90)
ax.pie(sizes, explode=[0.1, 0, 0, 0], shadow=True)   # "explode" one slice out
```
> [!tip] Pie charts are generally discouraged for >5 categories — hard to compare slice sizes visually. Bar chart is usually clearer.

## 📦 Box plot

```python
ax.boxplot(data)                          # data = list of arrays, one box per array
ax.boxplot(data, labels=["A", "B", "C"], vert=True, showmeans=True)
```

## 🎻 Violin plot

```python
ax.violinplot(data)
```

## 🗺️ Area plot

```python
ax.fill_between(x, y1, y2, alpha=0.3)          # shade region between two curves
ax.stackplot(x, y1, y2, y3, labels=["A","B","C"])   # stacked area
```

## 🌡️ Heatmap / 2D data

```python
ax.imshow(matrix, cmap="viridis")
ax.pcolormesh(X, Y, Z, cmap="coolwarm")
```
See [[Matplotlib Colors & Colormaps]] for colorbar setup.

## 🔺 Error bars

```python
ax.errorbar(x, y, yerr=errors, fmt="o", capsize=5)
```

## 📐 Step plot

```python
ax.step(x, y, where="mid")   # "pre", "post", or "mid"
```

## 🧮 Quick decision table

| Data shape | Plot type |
|---|---|
| Trend over continuous x | `plot` (line) |
| Two continuous variables, relationship | `scatter` |
| Comparing categories | `bar` / `barh` |
| Distribution of one variable | `hist` |
| Distribution across groups | `boxplot` / `violinplot` |
| Part-to-whole (few categories) | `pie` |
| 2D grid / matrix data | `imshow` / `pcolormesh` |

## 🔗 Next

[[Matplotlib Styling & Customization]] · [[Matplotlib Colors & Colormaps]]
