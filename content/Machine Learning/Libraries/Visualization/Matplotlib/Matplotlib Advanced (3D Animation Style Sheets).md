---
title: Matplotlib Advanced (3D Animation Style Sheets)
tags: [matplotlib, python, 3d, animation, advanced, cheatsheet]
aliases: [Matplotlib 3D, Matplotlib Animation]
status: evergreen
---

# Matplotlib Advanced (3D Animation Style Sheets)

## 🧊 3D plots

```python
from mpl_toolkits.mplot3d import Axes3D   # registers 3D projection, import needed even if unused directly

fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

ax.plot3D(x, y, z)
ax.scatter3D(x, y, z, c=z, cmap="viridis")
ax.plot_surface(X, Y, Z, cmap="viridis")      # X,Y,Z from np.meshgrid
ax.plot_wireframe(X, Y, Z)

ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")
ax.view_init(elev=30, azim=45)      # camera angle
```

## 🎞️ Animation

```python
from matplotlib.animation import FuncAnimation

fig, ax = plt.subplots()
line, = ax.plot([], [])

def init():
    ax.set_xlim(0, 10)
    ax.set_ylim(-1, 1)
    return line,

def update(frame):
    x = np.linspace(0, 10, 100)
    y = np.sin(x + frame / 10)
    line.set_data(x, y)
    return line,

anim = FuncAnimation(fig, update, frames=100, init_func=init, blit=True, interval=50)
plt.show()
```

```python
anim.save("animation.gif", writer="pillow", fps=20)
anim.save("animation.mp4", writer="ffmpeg", fps=20)   # requires ffmpeg installed
```

> [!warning] `blit=True` speeds up rendering but requires `update()` to return the changed artists as a tuple — easy to get wrong on first try.

## 🖼️ Style sheets (recap + custom)

```python
plt.style.use("ggplot")
plt.style.use(["seaborn-v0_8", "dark_background"])   # stack multiple, later ones override

with plt.style.context("ggplot"):    # apply temporarily, only within this block
    fig, ax = plt.subplots()
    ax.plot(x, y)
```

### Custom style file

```
# mystyle.mplstyle
axes.facecolor: eeeeee
axes.grid: True
grid.color: white
lines.linewidth: 2
font.size: 12
```
```python
plt.style.use("mystyle.mplstyle")
```

## 🧩 Interactive backends (Jupyter)

```python
%matplotlib inline        # static images, default
%matplotlib widget            # interactive, zoomable (needs ipympl installed)
%matplotlib notebook              # older interactive backend
```

## ⚡ Performance tips for large datasets

```python
ax.plot(x, y, rasterized=True)         # rasterize a vector element to reduce file size/render time
matplotlib.use("Agg")                     # non-interactive backend, faster for batch/headless script rendering
```
> [!tip] For scatter plots with 100k+ points, consider downsampling or using `plt.hexbin()`/2D histograms instead — raw scatter gets slow and visually overplotted.

## 🔗 Back to

[[Matplotlib]]
