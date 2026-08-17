---
title: Matplotlib Subplots & Layouts
tags: [matplotlib, python, subplots, gridspec, cheatsheet]
aliases: [Matplotlib Multiple Plots, GridSpec]
status: evergreen
---

# Matplotlib Subplots & Layouts

## 🔲 Basic grid of subplots

```python
fig, axs = plt.subplots(2, 2)              # 2x2 grid, axs is a 2D array of Axes
fig, axs = plt.subplots(2, 2, figsize=(10, 8))

axs[0, 0].plot(x, y)      # top-left
axs[0, 1].bar(cats, vals)    # top-right
axs[1, 0].hist(data)            # bottom-left
axs[1, 1].scatter(x, y)            # bottom-right
```

```python
fig, axs = plt.subplots(1, 3)      # 1 row, 3 cols → axs is a 1D array
for ax, data in zip(axs, datasets):
    ax.plot(data)
```

## 🔗 Shared axes

```python
fig, axs = plt.subplots(2, 2, sharex=True, sharey=True)
```
> [!tip] `sharex`/`sharey` = same scale across subplots, only outer ticks shown. Good for genuine comparison across panels.

## 📏 Sizing individual subplots

```python
fig, axs = plt.subplots(1, 2, gridspec_kw={"width_ratios": [3, 1]})   # first subplot 3x wider
fig, axs = plt.subplots(2, 1, gridspec_kw={"height_ratios": [1, 2]})
```

## 🧩 GridSpec — irregular layouts

```python
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(10, 6))
gs = gridspec.GridSpec(2, 3, figure=fig)

ax1 = fig.add_subplot(gs[0, :])       # top row, spans all columns
ax2 = fig.add_subplot(gs[1, 0])          # bottom-left
ax3 = fig.add_subplot(gs[1, 1])             # bottom-middle
ax4 = fig.add_subplot(gs[1, 2])                # bottom-right
```

## 🧩 subplot_mosaic — simpler irregular layouts

```python
fig, axs = plt.subplot_mosaic([
    ["top", "top"],
    ["left", "right"]
])
axs["top"].plot(x, y)
axs["left"].bar(cats, vals)
axs["right"].hist(data)
```
> [!tip] `subplot_mosaic` is often cleaner than GridSpec for named, irregular layouts — access panels by string key instead of index.

## 📐 Adjusting spacing

```python
fig.tight_layout()                                    # auto-fix overlapping labels/titles — use this by default
plt.subplots_adjust(wspace=0.3, hspace=0.4)               # manual spacing (width/height space between subplots)
fig.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.1)
```
> [!warning] Forgetting `tight_layout()` is the #1 cause of overlapping/cut-off titles and labels in multi-panel figures.

## 🔁 Iterating over all axes

```python
for ax in axs.flat:          # works for any shape (1D or 2D) — flattens automatically
    ax.grid(True)
```

## 🪟 Twin axes (two y-scales, same x)

See [[Matplotlib Axes Configuration]] for `twinx()` / `twiny()`.

## 🔗 Next

[[Matplotlib Axes Configuration]] · [[Matplotlib Saving & Exporting]]
