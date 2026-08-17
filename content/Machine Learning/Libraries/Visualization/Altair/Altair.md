---
title: Altair
tags: [altair, python, data-visualization, moc, index, cheatsheet]
aliases: [Altair Cheatsheet, Vega-Lite Python]
status: evergreen
---

# Altair

## 🧠 What is Altair

Declarative statistical visualization library for Python, built on Vega-Lite. You describe *what* the data means (this column is quantitative, that one is a category) and Altair figures out *how* to draw it. Output is interactive by default (zoom, tooltips, selections) and renders as JSON spec → JavaScript/SVG, not a static image like Matplotlib.

| | Matplotlib/Seaborn | Altair |
|---|---|---|
| Paradigm | Imperative (you draw each element) | Declarative (you describe encodings, it draws) |
| Output | Static image (PNG/PDF) by default | Interactive HTML/JSON (Vega-Lite spec) |
| Syntax | Function calls | Method chaining on a `Chart` object |
| Data input | Arrays or DataFrame columns | DataFrame only |

> [!tip] Every Altair chart is built the same way: `Chart(data).mark_X().encode(...)`. Learn that shape once, everything else is variations on it.

## 📚 Map of Content

- [[Altair Basics & Chart Object]] - Chart, mark, encode, install, first chart
- [[Altair Marks & Encodings]] - mark types, encoding channels (x, y, color, size...)
- [[Altair Data Types & Transformations]] - quantitative/nominal/ordinal/temporal, bin, aggregate, filter
- [[Altair Interactivity]] - selections, params, tooltips, conditional encoding
- [[Altair Composition & Layouts]] - layer, facet, hconcat/vconcat, repeat
- [[Altair Styling & Themes]] - color scales, configure, themes
- [[Altair Saving & Exporting]] - save to HTML/PNG/SVG/JSON

## ⚡ Minimal example

```python
import altair as alt
import pandas as pd

df = pd.DataFrame({"x": [1,2,3], "y": [4,1,5]})

chart = alt.Chart(df).mark_line(point=True).encode(
    x="x",
    y="y"
)
chart.show()   # or chart in a Jupyter cell, or chart.save("out.html")
```

```bash
pip install altair vega_datasets
```
