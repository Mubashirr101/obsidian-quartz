---
title: Matplotlib Colors & Colormaps
tags: [matplotlib, python, colormaps, colorbar, cheatsheet]
aliases: [Matplotlib cmap, Matplotlib colorbar]
status: evergreen
---

# Matplotlib Colors & Colormaps

## 🌈 Using a colormap

```python
scatter = ax.scatter(x, y, c=values, cmap="viridis")
fig.colorbar(scatter, ax=ax, label="Value")

img = ax.imshow(matrix, cmap="coolwarm")
fig.colorbar(img, ax=ax)
```
> [!warning] `fig.colorbar()` needs the actual plot object returned by `scatter`/`imshow`/etc — not the axes. Always capture the return value.

## 🎨 Common colormap categories

| Type | Use for | Examples |
|---|---|---|
| Sequential | Ordered data, low → high | `"viridis"`, `"plasma"`, `"Blues"`, `"YlOrRd"` |
| Diverging | Data with a meaningful midpoint (e.g. 0) | `"coolwarm"`, `"RdBu"`, `"seismic"` |
| Qualitative | Distinct, unordered categories | `"tab10"`, `"Set2"`, `"Pastel1"` |
| Cyclic | Data that wraps around (e.g. angles) | `"twilight"`, `"hsv"` |

> [!tip] `"viridis"` is the modern default — perceptually uniform and colorblind-friendly. Avoid `"jet"` (old default, visually misleading).

```python
print(plt.colormaps())     # list every available colormap name
```

## 🔄 Reversed colormap

```python
ax.imshow(matrix, cmap="viridis_r")   # append _r to reverse any colormap
```

## 🎚️ Normalization (controlling the color scale range)

```python
import matplotlib.colors as mcolors

norm = mcolors.Normalize(vmin=0, vmax=100)
ax.scatter(x, y, c=values, cmap="viridis", norm=norm)

# diverging data centered at 0
norm = mcolors.TwoSlopeNorm(vmin=-10, vcenter=0, vmax=10)
ax.imshow(matrix, cmap="coolwarm", norm=norm)

# log-scaled color values
norm = mcolors.LogNorm(vmin=1, vmax=1000)
```

## 📊 Discrete colormap (fixed number of bins)

```python
cmap = plt.get_cmap("viridis", 5)      # 5 discrete color levels instead of continuous
```

## 🎨 Manual color cycle

```python
ax.set_prop_cycle(color=["red", "green", "blue"])
for y in datasets:
    ax.plot(x, y)      # cycles through the specified colors in order
```

## 🖌️ Custom colormap

```python
from matplotlib.colors import LinearSegmentedColormap

custom = LinearSegmentedColormap.from_list("custom", ["blue", "white", "red"])
ax.imshow(matrix, cmap=custom)
```

## 🎛️ Colorbar customization

```python
cbar = fig.colorbar(img, ax=ax, label="Value", shrink=0.8, orientation="vertical")
cbar.set_ticks([0, 50, 100])
cbar.ax.set_ylabel("Value", rotation=270, labelpad=15)
```

## 🔗 Next

[[Matplotlib Plot Types]] · [[Matplotlib Saving & Exporting]]
