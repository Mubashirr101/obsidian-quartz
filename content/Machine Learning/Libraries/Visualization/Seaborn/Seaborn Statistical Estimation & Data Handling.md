---
title: Seaborn Statistical Estimation & Data Handling
tags: [seaborn, python, statistics, confidence-interval, long-format, cheatsheet]
aliases: [Seaborn hue, Seaborn confidence interval, Long vs Wide Data]
status: evergreen
---

# Seaborn Statistical Estimation & Data Handling

## 🎨 The core semantic mappings

```python
sns.scatterplot(data=df, x="x", y="y", hue="category", size="value", style="group")
```

| Param | Maps a variable to | Works with |
|---|---|---|
| `hue=` | color | most plot types |
| `size=` | point/line size or width | scatter, line |
| `style=` | marker shape / line dashes | scatter, line |

> [!tip] `hue` + `style` together on the same variable = redundant encoding (color AND shape both show the category) — genuinely helpful for colorblind accessibility or grayscale printing.

## 📏 Confidence intervals / error bars

```python
sns.lineplot(data=df, x="x", y="y", errorbar="sd")             # standard deviation
sns.lineplot(data=df, x="x", y="y", errorbar=("ci", 95))          # confidence interval, 95%
sns.lineplot(data=df, x="x", y="y", errorbar=("pi", 50))             # percentile interval
sns.lineplot(data=df, x="x", y="y", errorbar=None)                      # no error band at all
sns.barplot(data=df, x="cat", y="y", errorbar="se")                        # standard error
```

> [!note] Seaborn computes these automatically via bootstrapping when there are multiple y-values per x. This is the main thing that separates Seaborn's `lineplot`/`barplot` from plain matplotlib equivalents.

## 🧮 estimator — how repeated values get aggregated

```python
sns.barplot(data=df, x="day", y="total_bill", estimator="mean")      # default
sns.barplot(data=df, x="day", y="total_bill", estimator="median")
sns.barplot(data=df, x="day", y="total_bill", estimator="sum")
sns.barplot(data=df, x="day", y="total_bill", estimator=len)            # count
```

## 📐 Long vs wide format data

```python
# WIDE format — one column per category
#    Male  Female
# 0   23      25
# 1   19      22

# LONG format — one row per observation, category as a value
#    sex     value
# 0  Male     23
# 1  Female   25
```

```python
wide_to_long = df.melt(id_vars="id", var_name="sex", value_name="value")   # pandas: wide → long
```

> [!tip] Seaborn generally expects LONG format (`x=`, `y=`, `hue=` as column names). Most real-world CSVs come wide — `df.melt()` is the standard fix.

```python
sns.boxplot(data=long_df, x="sex", y="value")      # works cleanly on long data
```

## 🧾 Handling missing data

```python
sns.scatterplot(data=df.dropna(subset=["x", "y"]), x="x", y="y")   # drop NaNs before plotting
```
> [!warning] Seaborn generally silently drops NaN rows for the relevant columns rather than erroring — good to know when a plot has fewer points than expected.

## 🔢 Ordering categories explicitly

```python
sns.boxplot(data=df, x="day", y="total_bill", order=["Thur", "Fri", "Sat", "Sun"])
sns.barplot(data=df, x="day", y="total_bill", hue="sex", hue_order=["Male", "Female"])
```
> [!tip] Without `order=`, category axis order is whatever pandas/Seaborn infers (often alphabetical) — explicitly set it whenever a natural order (days, sizes, ratings) matters.

## 🔗 Related

[[Seaborn Categorical Plots]] · [[Seaborn Relational Plots]] · [[Seaborn]]
