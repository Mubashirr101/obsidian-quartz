---
title: Matplotlib Styling & Customization
tags: [matplotlib, python, styling, legend, cheatsheet]
aliases: [Matplotlib Legend, Matplotlib Colors]
status: evergreen
---

# Matplotlib Styling & Customization

## 🎨 Color options

```python
ax.plot(x, y, color="red")           # named color
ax.plot(x, y, color="#3498db")          # hex
ax.plot(x, y, color=(0.2, 0.4, 0.6))       # RGB tuple, 0-1 range
ax.plot(x, y, color="C0")                     # matplotlib default cycle color (C0-C9)
```

## ➖ Line styles

```python
ax.plot(x, y, linestyle="-")     # solid (default)
ax.plot(x, y, linestyle="--")       # dashed
ax.plot(x, y, linestyle=":")           # dotted
ax.plot(x, y, linestyle="-.")             # dash-dot
ax.plot(x, y, linewidth=2.5)
```

## 🔘 Markers

```python
ax.plot(x, y, marker="o")     # circle
ax.plot(x, y, marker="s")        # square
ax.plot(x, y, marker="^")           # triangle
ax.plot(x, y, marker="*")              # star
ax.plot(x, y, marker="x")                 # x
ax.plot(x, y, markersize=8, markerfacecolor="white", markeredgecolor="black")
```

## 🧪 Shorthand format string

```python
ax.plot(x, y, "ro--")     # red, circle markers, dashed line — color+marker+linestyle combined
```

## 🏷️ Titles and labels

```python
ax.set_title("My Chart", fontsize=14, fontweight="bold")
ax.set_xlabel("X Axis")
ax.set_ylabel("Y Axis")
fig.suptitle("Overall Figure Title")   # title for the whole figure, above all subplots
```

## 🗒️ Legend

```python
ax.plot(x, y, label="series 1")
ax.legend()                                  # uses the label= from each plot call
ax.legend(loc="upper right")                    # position
ax.legend(loc="best")                              # let matplotlib pick
ax.legend(["A", "B"])                                  # manual labels, ignores label= kwargs
ax.legend(bbox_to_anchor=(1.05, 1), loc="upper left")     # place outside the axes
```

| `loc` value | Position |
|---|---|
| `"best"` | auto |
| `"upper right"` / `"upper left"` | corners |
| `"lower right"` / `"lower left"` | corners |
| `"center"` | center |

## 🔲 Grid

```python
ax.grid(True)
ax.grid(True, linestyle="--", alpha=0.5, axis="y")   # axis="x"/"y"/"both"
```

## 🎭 Transparency

```python
ax.plot(x, y, alpha=0.5)      # 0 = invisible, 1 = opaque
```

## 🖼️ Global style sheets

```python
plt.style.use("ggplot")
plt.style.use("seaborn-v0_8")
plt.style.use("dark_background")
print(plt.style.available)      # list every built-in style
```
> [!tip] Style sheets change colors, gridlines, fonts globally in one line — faster than manual styling for a consistent look.

## 🧮 rcParams — global defaults

```python
plt.rcParams["figure.figsize"] = (10, 6)
plt.rcParams["font.size"] = 12
plt.rcParams["lines.linewidth"] = 2
```
> [!tip] Set once at the top of a script/notebook to apply consistent defaults across every subsequent plot.

## 🔗 Next

[[Matplotlib Axes Configuration]] · [[Matplotlib Annotations & Text]]
