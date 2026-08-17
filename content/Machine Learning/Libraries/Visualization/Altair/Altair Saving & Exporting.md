---
title: Altair Saving & Exporting
tags: [altair, python, save, export, cheatsheet]
aliases: [Altair save]
status: evergreen
---

# Altair Saving & Exporting

## 💾 Basic save

```python
chart.save("chart.html")      # interactive, self-contained — always works, no extra deps
chart.save("chart.json")         # raw Vega-Lite spec
chart.save("chart.png")             # static image — needs extra setup, see below
chart.save("chart.svg")                # static vector — needs extra setup, see below
chart.save("chart.pdf")                   # needs extra setup, see below
```

> [!warning] PNG/SVG/PDF export requires an extra dependency (`vl-convert-python` is the modern, recommended one). HTML and JSON work with zero extra setup.

```bash
pip install vl-convert-python
```

## 🎯 Resolution for PNG export

```python
chart.save("chart.png", ppi=300)      # higher resolution for print quality
```

## 🖼️ Embedding in HTML manually

```python
chart.save("chart.html", embed_options={"actions": False})   # hides the "..." export menu in the corner
```

## 📓 In Jupyter

```python
chart                # just the last expression in a cell — auto-renders interactively
```
No `.show()` or `plt.show()` equivalent needed inside Jupyter itself.

## 🌐 Outside Jupyter (plain script)

```python
chart.show()      # opens in default browser via a local server
```

## 📄 Getting the raw spec (for embedding elsewhere, e.g. a web app)

```python
spec = chart.to_dict()          # Python dict of the full Vega-Lite spec
spec_json = chart.to_json()        # as a JSON string
```
> [!tip] `to_dict()`/`to_json()` is the bridge to using an Altair-built chart inside a JS frontend (Vega-Lite runtime), a Streamlit app, or any tool that accepts a raw Vega-Lite spec.

## 🖥️ Renderers (how charts get displayed)

```python
alt.renderers.enable("default")     # standard, works in Jupyter/JupyterLab
alt.renderers.enable("mimetype")       # alternative for some notebook environments
print(alt.renderers.names())              # list available renderers
```

## 🧮 Row limit warning

> [!warning] Altair embeds data directly in the chart spec and defaults to a 5,000-row limit, throwing a `MaxRowsError` beyond that. For larger data: aggregate before plotting, or disable the check.

```python
alt.data_transformers.disable_max_rows()      # removes the limit — fine for moderate overages, risky for huge data
```
```python
alt.data_transformers.enable("vegafusion")     # better long-term fix: pushes aggregation to a backend, handles large data properly
```

## 🔗 Related

[[Altair Styling & Themes]] · [[Altair]]
