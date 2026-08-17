---
title: Altair Styling & Themes
tags: [altair, python, themes, color-scales, configure, cheatsheet]
aliases: [Altair configure, Altair color scale]
status: evergreen
---

# Altair Styling & Themes

## 🌈 Color scales

```python
alt.Color("category:N", scale=alt.Scale(scheme="category10"))
alt.Color("value:Q", scale=alt.Scale(scheme="viridis"))
alt.Color("value:Q", scale=alt.Scale(scheme="redblue", domainMid=0))    # diverging, centered

alt.Color("category:N", scale=alt.Scale(range=["#e74c3c", "#3498db", "#2ecc71"]))   # manual colors
```

| Scheme category | Examples |
|---|---|
| Categorical | `"category10"`, `"category20"`, `"tableau10"` |
| Sequential | `"blues"`, `"viridis"`, `"greens"` |
| Diverging | `"redblue"`, `"purpleorange"` |

## 🏷️ Axis and legend customization

```python
alt.X("value:Q", axis=alt.Axis(title="Total Value", format="$.2f", labelAngle=45))
alt.Color("category:N", legend=alt.Legend(title="Category", orient="bottom"))
alt.Y("value:Q", axis=None)      # hide the axis entirely
```

## ⚙️ Chart-level configure

```python
chart.configure_axis(labelFontSize=12, titleFontSize=14, grid=False)
chart.configure_title(fontSize=18, anchor="start")
chart.configure_view(strokeWidth=0)          # remove the chart border
chart.configure_mark(opacity=0.8)
```
> [!tip] `.configure_X()` methods only work on the TOP-LEVEL chart (after composing with `|`, `&`, `+`) — calling them on a sub-chart before composition has no effect on the final output.

## 🎨 Built-in themes

```python
alt.themes.enable("dark")
alt.themes.enable("fivethirtyeight")
alt.themes.enable("googlecharts")
print(alt.themes.names())      # list all available themes
```
```python
alt.themes.enable("default")   # reset back to default
```
> [!tip] Enabling a theme is global — set once near the top of a script/notebook, every chart created after inherits it, same idea as `sns.set_theme()` in Seaborn.

## 🖌️ Custom theme

```python
def my_theme():
    return {
        "config": {
            "view": {"strokeWidth": 0},
            "axis": {"grid": False},
            "range": {"category": ["#e74c3c", "#3498db", "#2ecc71"]}
        }
    }

alt.themes.register("my_theme", my_theme)
alt.themes.enable("my_theme")
```

## 📐 Sizing and shape

```python
chart.properties(width=500, height=300)
chart.mark_point(size=100)
chart.properties(width="container")      # responsive — fills parent container width (in HTML embed contexts)
```

## 🔗 Next

[[Altair Saving & Exporting]] · [[Altair Composition & Layouts]]
