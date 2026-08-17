---
title: Seaborn Regression Plots
tags: [seaborn, python, regplot, lmplot, regression, cheatsheet]
aliases: [Seaborn regplot, Seaborn lmplot]
status: evergreen
---

# Seaborn Regression Plots

Scatter + a fitted trend line, with confidence interval.

## 📈 regplot — axes-level

```python
sns.regplot(data=df, x="total_bill", y="tip")
sns.regplot(data=df, x="total_bill", y="tip", ci=95)             # confidence interval band, default 95
sns.regplot(data=df, x="total_bill", y="tip", ci=None)               # no CI shading
sns.regplot(data=df, x="total_bill", y="tip", order=2)                  # polynomial fit (quadratic here)
sns.regplot(data=df, x="total_bill", y="tip", logistic=True)               # logistic regression (binary y)
sns.regplot(data=df, x="total_bill", y="tip", scatter=False)                  # line only, no points
```

## 🎯 lmplot — figure-level, supports faceting

```python
sns.lmplot(data=df, x="total_bill", y="tip", hue="smoker")                # separate line per category
sns.lmplot(data=df, x="total_bill", y="tip", col="time")                     # facet into columns
sns.lmplot(data=df, x="total_bill", y="tip", col="time", row="sex")             # full grid
```

> [!tip] `regplot` = single axes, no faceting, works with `ax=`. `lmplot` = figure-level, supports `hue`/`col`/`row` faceting like `relplot`/`catplot`. Same underlying regression logic.

## 📉 residplot — residuals of a linear fit

```python
sns.residplot(data=df, x="total_bill", y="tip")
```
> [!tip] Residuals should look like random scatter around 0. A visible curve/pattern in residuals means a linear fit is a poor choice for that data.

## 🧮 Choosing fit order

```python
sns.regplot(data=df, x="x", y="y", order=1)   # linear (default)
sns.regplot(data=df, x="x", y="y", order=2)      # quadratic
sns.regplot(data=df, x="x", y="y", order=3)         # cubic
```
> [!warning] Higher order = more prone to overfitting, especially with limited data. Only bump order if a linear fit visibly, genuinely doesn't capture the trend.

## 🔗 Next

[[Seaborn Matrix & Heatmaps]] · [[Seaborn Multi-Plot Grids]]
