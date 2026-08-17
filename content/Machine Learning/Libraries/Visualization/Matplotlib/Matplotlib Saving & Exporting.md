---
title: Matplotlib Saving & Exporting
tags: [matplotlib, python, savefig, export, cheatsheet]
aliases: [Matplotlib savefig]
status: evergreen
---

# Matplotlib Saving & Exporting

## 💾 Basic save

```python
fig.savefig("plot.png")
fig.savefig("plot.pdf")           # vector format, scales infinitely
fig.savefig("plot.svg")              # vector, editable in Illustrator/Inkscape
fig.savefig("plot.jpg")                 # lossy, avoid for line art/text-heavy plots
```

> [!tip] Use PNG for raster (photos, complex plots), PDF/SVG for vector (papers, print, anything that needs to scale without pixelation).

## 🎯 Resolution (DPI)

```python
fig.savefig("plot.png", dpi=300)      # print-quality
fig.savefig("plot.png", dpi=72)          # screen/web quality
```
> [!tip] 300 DPI is the standard minimum for print/publication. 72-150 DPI is plenty for web/screen use.

## ✂️ Trimming whitespace

```python
fig.savefig("plot.png", bbox_inches="tight")            # crop to content, removes excess margin
fig.savefig("plot.png", bbox_inches="tight", pad_inches=0.1)   # tight + small padding
```
> [!warning] Without `bbox_inches="tight"`, legends or labels placed outside the axes (e.g. via `bbox_to_anchor`) can get cut off in the saved file even though they display fine in `plt.show()`.

## 🎨 Background / transparency

```python
fig.savefig("plot.png", transparent=True)          # transparent background — good for overlaying on slides/docs
fig.savefig("plot.png", facecolor="white")             # explicit background color
```

## 📐 Size control

```python
fig, ax = plt.subplots(figsize=(10, 6))    # set size BEFORE plotting, in inches
fig.set_size_inches(12, 8)                    # or resize an existing figure
```

## 🧮 Full production-quality example

```python
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(x, y)
ax.set_title("Report Chart")
fig.tight_layout()
fig.savefig("report_chart.png", dpi=300, bbox_inches="tight", transparent=False)
```

## 🖼️ Saving before show()

```python
fig.savefig("plot.png")   # save FIRST
plt.show()                    # then show — plt.show() can clear the figure on some backends
```
> [!warning] Calling `plt.show()` before `savefig()` can occasionally result in a blank saved file, depending on the backend. Save first as a safe default habit.

## 🔗 Next

[[Matplotlib Advanced (3D Animation Style Sheets)]] · [[Matplotlib]]
