---
title: Matplotlib
tags: [matplotlib, python, data-visualization, moc, index, cheatsheet]
aliases: [Matplotlib Cheatsheet, pyplot]
status: evergreen
---

# Matplotlib

## 🧠 What is Matplotlib

Python's core plotting library. Everything else (Seaborn, Pandas `.plot()`) is built on top of it. Two APIs:

| API | Style | Use for |
|---|---|---|
| `pyplot` (`plt`) | Implicit, MATLAB-style, tracks "current" figure/axes | Quick, one-off plots |
| Object-oriented (`fig, ax`) | Explicit, you hold references | Multi-panel plots, reusable code, production |

> [!tip] Default to the OO API (`fig, ax = plt.subplots()`) even for simple plots. Scales better, avoids "current axes" confusion.

## 📚 Map of Content

- [[Matplotlib Basics & Figure Anatomy]] - Figure/Axes structure, both APIs, minimal plot
- [[Matplotlib Plot Types]] - line, scatter, bar, hist, pie, box, etc.
- [[Matplotlib Styling & Customization]] - colors, linestyles, markers, labels, legends
- [[Matplotlib Subplots & Layouts]] - multiple axes, gridspec, figure size
- [[Matplotlib Axes Configuration]] - limits, ticks, scales, spines, twin axes
- [[Matplotlib Annotations & Text]] - text, arrows, annotate
- [[Matplotlib Colors & Colormaps]] - colormaps, colorbar, normalization
- [[Matplotlib Saving & Exporting]] - savefig, dpi, formats
- [[Matplotlib Advanced (3D Animation Style Sheets)]] - 3D plots, animation, style sheets

## ⚡ Minimal example

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [4, 1, 5])
ax.set_title("My Plot")
plt.show()
```

```bash
pip install matplotlib
```
