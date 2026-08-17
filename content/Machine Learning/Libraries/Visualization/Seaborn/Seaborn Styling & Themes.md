---
title: Seaborn Styling & Themes
tags: [seaborn, python, themes, palettes, styling, cheatsheet]
aliases: [Seaborn set_theme, Seaborn palette]
status: evergreen
---

# Seaborn Styling & Themes

## 🎨 set_theme — global one-liner

```python
sns.set_theme()                                     # apply Seaborn's default look to everything after this
sns.set_theme(style="whitegrid", palette="pastel")      # common combo
sns.set_theme(style="darkgrid", context="talk")            # bigger fonts, for presentations
```
> [!tip] Call `sns.set_theme()` once at the top of a script/notebook — every plot after it (Seaborn AND plain matplotlib) inherits the styling.

## 🖼️ style — background/grid look

```python
sns.set_style("darkgrid")      # default, gray background + white gridlines
sns.set_style("whitegrid")        # white background + gray gridlines
sns.set_style("dark")                # gray background, no grid
sns.set_style("white")                  # plain white, no grid — good for adding own annotations
sns.set_style("ticks")                     # white + tick marks, no grid
```

```python
with sns.axes_style("whitegrid"):      # apply temporarily, only within this block
    sns.scatterplot(data=df, x="x", y="y")
```

## 🔍 context — scale for output medium

```python
sns.set_context("paper")        # smallest — for print/publication
sns.set_context("notebook")        # default
sns.set_context("talk")               # larger — presentations
sns.set_context("poster")                # largest — posters
```
> [!tip] Use `context` to resize fonts/lines/markers for the actual output medium, without manually tweaking every font size.

## 🌈 Color palettes

```python
sns.set_palette("pastel")
sns.set_palette("Set2")
sns.set_palette("viridis")

sns.color_palette("husl", 8)          # 8 evenly-spaced hues
sns.color_palette("coolwarm", as_cmap=True)   # get it as a matplotlib colormap object
```

```python
sns.scatterplot(data=df, x="x", y="y", hue="cat", palette="Set2")   # per-plot override, no need to set globally
```

| Palette type | Examples | Use for |
|---|---|---|
| Qualitative | `"Set1"`, `"Set2"`, `"pastel"`, `"husl"` | Unordered categories |
| Sequential | `"Blues"`, `"viridis"`, `"rocket"` | Ordered/continuous data |
| Diverging | `"coolwarm"`, `"RdBu"`, `"vlag"` | Data with a meaningful midpoint |

```python
sns.color_palette("husl", 8)      # preview: run in Jupyter, auto-displays swatches
sns.palplot(sns.color_palette("husl", 8))   # explicit swatch display
```

## 🎨 Custom palette

```python
custom = ["#e74c3c", "#3498db", "#2ecc71"]
sns.set_palette(custom)
sns.scatterplot(data=df, x="x", y="y", hue="cat", palette=custom)
```

## 🧵 despine — clean up borders

```python
sns.despine()                          # removes top + right spines (default), matplotlib equivalent in Matplotlib Axes Configuration
sns.despine(left=True)                    # also remove left spine
sns.despine(offset=10, trim=True)            # offset spines outward + trim to data range
```

## 🔗 Next

[[Seaborn Statistical Estimation & Data Handling]] · [[Matplotlib Styling & Customization]]
