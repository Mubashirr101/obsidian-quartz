---
title: Data Analysis
tags: [data-science, home]
created: 2026-08-21
---

# 📈 Data Analysis

Process of inspecting, cleaning, transforming, and modeling data to extract useful information and support decisions. Sits between raw data and a business answer.

---

## Core stages

| Stage | What happens | Output |
|---|---|---|
| Collection | Get data from source (scrape, API, DB, file) | Raw dataset |
| Cleaning | Fix types, nulls, duplicates, units | Usable dataset |
| Feature engineering | Derive new fields, encode categoricals | Model-ready dataset |
| EDA | Explore distributions, relationships, outliers | Insights, charts |
| Modeling | Fit statistical/ML model | Predictions, feature importance |
| Communication | Dashboard, report, presentation | Decision support |

---

## Types of analysis

- **Descriptive**: what happened (summary stats, trends)
- **Diagnostic**: why it happened (correlation, drill-down)
- **Predictive**: what will happen (regression, classification, forecasting)
- **Prescriptive**: what to do about it (optimization, recommendation)

Most real projects are descriptive + diagnostic first, predictive only once the data supports it.

---

## Key concepts

**Population vs sample**
Sample should represent the population, watch for selection bias (e.g. scraping only 1BHK listings skews the whole dataset).

**Missing data**
- MCAR (missing completely at random), safe to drop
- MAR (missing depends on other observed vars), can impute
- MNAR (missing depends on the missing value itself), dangerous to impute blindly

**Correlation vs causation**
Correlation shows a relationship exists, not why. Confounding variables can create fake correlations (e.g. locality correlates with price because of amenities, not the locality name itself).

**Overfitting**
Model memorizes training data instead of learning patterns. Watch for a huge gap between train and test performance. More likely with small datasets and too many features.

**Bias-variance tradeoff**
- High bias = model too simple, underfits
- High variance = model too complex, overfits
- Goal is the sweet spot in between

---

## Common pitfalls

- Dropping nulls without checking if they're meaningful (e.g. null = "not applicable" vs actually missing)
- Using accuracy on imbalanced classes (99% accuracy predicting a rare event that occurs 1% of the time)
- Data leakage: a feature secretly encodes the target (e.g. using "days to sale" to predict "will it sell")
- Small sample, big claims: 30 rows isn't enough to generalize anything
- Confusing statistical significance with practical significance

---

## Toolbox

| Task | Tool |
|---|---|
| Data wrangling | Pandas, NumPy |
| SQL/databases | PostgreSQL |
| Visualization | Matplotlib, Seaborn, PowerBI |
| Modeling | Scikit-learn |
| Notebooks | Jupyter |

---

## Workflow references
- [[data-analysis-roadmap|Data Analysis Roadmap]]
- [[data-analysis-notebook-template|Data Analysis Notebook Template]]

## Related MOCs
- [[pandas|Pandas]]
- [[numpy|NumPy]]
- [[Sklearn|Scikit-learn]]
- [[PostgreSQL]]
- [[PowerBI|PowerBI]]
