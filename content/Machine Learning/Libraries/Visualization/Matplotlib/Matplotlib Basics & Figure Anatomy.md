---
title: Matplotlib Basics & Figure Anatomy
tags: [matplotlib, python, figure, axes, cheatsheet]
aliases: [Matplotlib Figure, Matplotlib Axes]
status: evergreen
---

# Matplotlib Basics & Figure Anatomy

## 🧱 Core objects

| Object | What it is |
|---|---|
| `Figure` | The whole window/canvas. Can hold multiple Axes. |
| `Axes` | One individual plot (despite the name, not "axis"). Has x-axis, y-axis, title, data. |
| `Axis` | A single x or y axis within an Axes — ticks, labels, limits. |

```
Figure
 └── Axes (one subplot)
      ├── xaxis / yaxis
      ├── title, labels
      └── plotted data (lines, points, bars...)
```

## 🎯 Object-oriented API (preferred)

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.plot([1, 2, 3], [4, 1, 5])
ax.set_title("Title")
ax.set_xlabel("X")
ax.set_ylabel("Y")
plt.show()
```

## 🎯 pyplot (implicit) API

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3], [4, 1, 5])
plt.title("Title")
plt.xlabel("X")
plt.ylabel("Y")
plt.show()
```

> [!warning] `plt.xlabel()` acts on the "current" axes — gets confusing fast with multiple subplots. Use `ax.set_xlabel()` instead once you have more than one plot.

## 🔁 pyplot vs OO — same thing, different call

| pyplot | OO equivalent |
|---|---|
| `plt.plot(...)` | `ax.plot(...)` |
| `plt.title(...)` | `ax.set_title(...)` |
| `plt.xlabel(...)` | `ax.set_xlabel(...)` |
| `plt.ylabel(...)` | `ax.set_ylabel(...)` |
| `plt.xlim(...)` | `ax.set_xlim(...)` |
| `plt.legend(...)` | `ax.legend(...)` |
| `plt.show()` | `plt.show()` (same, always) |

## 🖼️ Creating a figure explicitly

```python
fig = plt.figure(figsize=(8, 5))          # size in inches
ax = fig.add_subplot(1, 1, 1)                # 1 row, 1 col, 1st subplot

fig, ax = plt.subplots(figsize=(8, 5))          # shorthand, same result
```

## 👁️ Displaying / closing

```python
plt.show()          # render the figure (blocking in scripts)
plt.close()             # close current figure, free memory
plt.close("all")           # close every open figure
plt.close(fig)                # close a specific figure
```

> [!tip] In Jupyter, `%matplotlib inline` renders automatically — `plt.show()` often unnecessary but harmless to include.

## 🔗 Next

[[Matplotlib Plot Types]] · [[Matplotlib Subplots & Layouts]]
