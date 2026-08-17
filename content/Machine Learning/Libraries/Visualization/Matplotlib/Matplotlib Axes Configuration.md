---
title: Matplotlib Axes Configuration
tags: [matplotlib, python, axes, ticks, scale, cheatsheet]
aliases: [Matplotlib Ticks, Matplotlib Log Scale, Matplotlib Twin Axes]
status: evergreen
---

# Matplotlib Axes Configuration

## 📏 Limits

```python
ax.set_xlim(0, 100)
ax.set_ylim(-10, 10)
ax.set_xlim(left=0)          # only set one bound
ax.autoscale()                  # let matplotlib auto-fit to data
```

## 🎯 Ticks

```python
ax.set_xticks([0, 25, 50, 75, 100])
ax.set_xticklabels(["A", "B", "C", "D", "E"])
ax.set_xticks([0, 25, 50, 75, 100], ["A","B","C","D","E"])   # combined, newer syntax

ax.tick_params(axis="x", rotation=45)             # rotate labels
ax.tick_params(axis="both", labelsize=10)
ax.tick_params(axis="y", direction="in")             # tick marks pointing inward
```

## 📐 Scale

```python
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_yscale("symlog")      # log scale that also handles negative/zero values
```
> [!tip] Use log scale when data spans multiple orders of magnitude — otherwise small values get visually crushed near zero.

## 🖼️ Spines (the box border)

```python
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.spines["left"].set_position(("outward", 10))   # offset a spine
ax.spines["bottom"].set_color("gray")
```
> [!tip] Removing top/right spines is a common, clean styling choice ("open" look).

## 🪟 Twin axes — two y-scales sharing one x-axis

```python
fig, ax1 = plt.subplots()
ax2 = ax1.twinx()          # shares x-axis, independent y-axis

ax1.plot(x, temperature, color="red")
ax1.set_ylabel("Temperature", color="red")

ax2.plot(x, humidity, color="blue")
ax2.set_ylabel("Humidity", color="blue")
```
> [!warning] Twin axes with two different scales can mislead viewers into false correlation. Label both axes clearly and color-code the lines to match.

`twiny()` = same idea but shared y, independent x.

## 🔳 Aspect ratio

```python
ax.set_aspect("equal")       # 1 unit x = 1 unit y (important for maps, circles)
ax.set_aspect("auto")           # default, stretches to fit figure
```

## 📍 Origin / invert axis

```python
ax.invert_yaxis()      # useful for e.g. depth or ranking plots (1st at top)
ax.invert_xaxis()
```

## 🔤 Formatting tick labels

```python
from matplotlib.ticker import FuncFormatter, PercentFormatter

ax.yaxis.set_major_formatter(FuncFormatter(lambda x, _: f"${x:,.0f}"))
ax.yaxis.set_major_formatter(PercentFormatter(xmax=1))
```

## 🔗 Next

[[Matplotlib Annotations & Text]] · [[Matplotlib Colors & Colormaps]]
