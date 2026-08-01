---
title: Plotting (.plot accessor)
tags: [pandas, python, plotting, matplotlib, visualization]
aliases: [df.plot, .plot accessor]
---

# Plotting — `.plot` Accessor

> [!abstract] Definition
> pandas wraps **matplotlib** to provide a quick `.plot()` accessor directly on `Series`/`DataFrame` objects for exploratory visualization, without needing to write matplotlib boilerplate for common chart types.

```python
import matplotlib.pyplot as plt
df.plot()
plt.show()
```

---

## Syntax

```python
df.plot(
    kind="line",         # 'line' | 'bar' | 'barh' | 'hist' | 'box' | 'kde' | 'area' | 'scatter' | 'pie'
    x=None,                # column for x-axis (default: index)
    y=None,                  # column(s) for y-axis (default: all numeric columns)
    figsize=(10, 6),
    title="My Chart",
    grid=True,
    legend=True,
    subplots=False           # separate subplot per column
)
```

---

## Chart Types

```python
df["sales"].plot(kind="line")                     # trend over index
df.plot.line(x="date", y="sales")

df.plot.bar(x="city", y="sales")                    # vertical bars
df.plot.barh(x="city", y="sales")                     # horizontal bars

df["age"].plot.hist(bins=20)                            # distribution
df["age"].plot(kind="hist", bins=20)

df.plot.box(column=["age", "salary"])                     # box plot, spot outliers
df["age"].plot.kde()                                         # kernel density estimate

df.plot.area(x="date", y=["product_a", "product_b"], stacked=True)  # stacked area

df.plot.scatter(x="age", y="salary")                            # relationship between 2 numeric cols
df.plot.scatter(x="age", y="salary", c="score", colormap="viridis")  # color by a 3rd variable

df.groupby("city")["sales"].sum().plot.pie(autopct="%1.1f%%")   # proportions
```

---

## Multiple Columns / Subplots

```python
df[["revenue", "cost"]].plot()                    # both lines on one chart
df[["revenue", "cost"]].plot(subplots=True)          # separate subplot per column
df.plot(secondary_y="cost")                             # second y-axis for one series
```

---

## Styling

```python
df.plot(
    color=["steelblue", "orange"],
    style=["-", "--"],
    linewidth=2,
    marker="o",
    title="Revenue vs Cost",
    xlabel="Date",
    ylabel="₹ (Lakhs)"
)
plt.tight_layout()
plt.savefig("chart.png", dpi=150)
```

---

## GroupBy + Plot Combos (Very Common Pattern)

```python
df.groupby("city")["sales"].sum().sort_values().plot.barh()
df.groupby("month")["revenue"].mean().plot(kind="line", marker="o")
df.pivot_table(values="sales", index="month", columns="region").plot()
```

---

## Correlation Heatmap (via matplotlib, not a `.plot` kind directly)

```python
import matplotlib.pyplot as plt
corr = df.corr(numeric_only=True)
plt.imshow(corr, cmap="coolwarm", vmin=-1, vmax=1)
plt.xticks(range(len(corr)), corr.columns, rotation=90)
plt.yticks(range(len(corr)), corr.columns)
plt.colorbar()
```

> [!tip] For richer statistical visuals (heatmaps with annotations, pairplots, violin plots), reach for **seaborn**, which is built on top of matplotlib and integrates directly with DataFrames: `import seaborn as sns; sns.heatmap(df.corr(), annot=True)`.

---

## Notes

> [!info] `.plot()` requires matplotlib installed (`pip install matplotlib`). For interactive/zoomable charts, consider `plotly.express` (`px.line(df, x="date", y="sales")`), which accepts DataFrames directly too.

---

## Related
- [[06-GroupBy]]
- [[08-Reshaping]]
- [[12-Aggregation-Statistics]]
