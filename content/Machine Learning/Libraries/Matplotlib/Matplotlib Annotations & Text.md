---
title: Matplotlib Annotations & Text
tags: [matplotlib, python, annotations, text, cheatsheet]
aliases: [Matplotlib annotate]
status: evergreen
---

# Matplotlib Annotations & Text

## 🔤 Plain text

```python
ax.text(x, y, "Some label")
ax.text(0.5, 0.5, "Centered", transform=ax.transAxes, ha="center", va="center")   # axes-relative coords (0-1)
ax.text(x, y, "Bold red", fontsize=12, color="red", fontweight="bold")
```

> [!tip] `transform=ax.transAxes` = coordinates are fractions of the axes (0,0 = bottom-left, 1,1 = top-right), independent of actual data values. Useful for fixed-position labels regardless of data range.

## 🎯 annotate — text + arrow pointing at a data point

```python
ax.annotate(
    "Peak value",
    xy=(peak_x, peak_y),               # point being annotated
    xytext=(peak_x + 5, peak_y + 2),      # where the text sits
    arrowprops=dict(facecolor="black", arrowstyle="->")
)
```

```python
ax.annotate(
    "Important",
    xy=(3, 5), xycoords="data",
    xytext=(0.7, 0.9), textcoords="axes fraction",   # mix data + axes-fraction coordinates
    arrowprops=dict(facecolor="red", shrink=0.05)
)
```

| arrowstyle | Look |
|---|---|
| `"->"` | simple arrow |
| `"-\|>"` | filled arrowhead |
| `"fancy"` | fat curved arrow |
| `"simple"` | thick simple arrow |

## 📏 Horizontal / vertical reference lines

```python
ax.axhline(y=0, color="gray", linestyle="--")
ax.axvline(x=5, color="gray", linestyle="--")
ax.axhspan(2, 4, alpha=0.2, color="yellow")      # shaded horizontal band
ax.axvspan(1, 3, alpha=0.2, color="blue")
```

## 🖼️ Text box styling

```python
ax.text(x, y, "Boxed note", bbox=dict(facecolor="white", edgecolor="black", boxstyle="round,pad=0.5"))
```

## 🔢 Data labels on bars

```python
bars = ax.bar(categories, values)
for bar in bars:
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2, height, f"{height}", ha="center", va="bottom")
```

## 🧮 Mathtext (LaTeX-like formatting)

```python
ax.set_title(r"$\alpha$ vs $\beta$")
ax.set_xlabel(r"$x^2 + y^2 = r^2$")
```
> [!tip] Wrap in `r"$...$"` — raw string + dollar signs enable LaTeX-style math rendering without a full LaTeX install.

## 🔗 Next

[[Matplotlib Colors & Colormaps]] · [[Matplotlib Saving & Exporting]]
