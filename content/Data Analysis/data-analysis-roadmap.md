---
title: Data Analysis Project Roadmap
tags: [checklist, workflow, data-science, MOC]
created: 2026-08-21
---

# 📊 Data Analysis Project Roadmap

> [!note] Based on CRISP-DM, the industry standard analysts follow. Adapted into a practical checklist. Use this as a MOC, link each phase to detailed notes as you build them out.

---

## 1. Business Understanding
- [ ] Define the question in one sentence (what are you actually trying to answer)
- [ ] Identify the target variable
- [ ] List who consumes the output (self, stakeholder, dashboard viewer)
- [ ] Define success criteria (accuracy threshold, insight clarity, decision it enables)
- [ ] Note constraints: data availability, timeline, tooling

---

## 2. Data Collection
- [ ] Identify data source(s)
- [ ] Check legality/ToS if scraping
- [ ] Pull a sample first, validate structure before full pull
- [ ] Log column names and row count of raw pull
- [ ] Save raw data untouched, never overwrite the raw file

```
data/
  raw/          <- never edit
  interim/      <- cleaning in progress
  processed/    <- model-ready
```

---

## 3. Data Understanding
- [ ] `.shape`, `.info()`, `.dtypes`
- [ ] Null count per column (as %, not just count)
- [ ] Unique values per categorical column
- [ ] Check for duplicate rows/records
- [ ] Sample 10-20 rows manually, sanity check against source
- [ ] Flag columns with near-zero variance (single unique value)
- [ ] Flag columns with suspiciously high cardinality (likely IDs/noise)

> [!tip] If a column is >70% missing on a small dataset, it's noise, not signal. Drop it or revisit after collecting more data.

---

## 4. Data Cleaning
- [ ] Fix dtypes (dates, numerics stored as strings, categoricals)
- [ ] Standardize units (sqft vs sqm, currency, date formats)
- [ ] Handle missing values: drop, impute, or flag, decide per column not blanket
- [ ] Deduplicate records
- [ ] Resolve conflicting/duplicate columns (e.g. two price fields, pick one and document why)
- [ ] Outlier check: does the value make physical/business sense
- [ ] Save cleaned dataset separately from raw

---

## 5. Feature Engineering
- [ ] Derive ratios/rates relevant to the domain (price per sqft, days on market, etc.)
- [ ] Encode categoricals (ordinal if order exists, one-hot otherwise)
- [ ] Extract components from compound fields (lat/long from a combined string, date parts)
- [ ] Bucket/bin continuous variables if it aids interpretation
- [ ] Create time-based features if timestamps exist (age, recency, days since)
- [ ] Re-check nulls introduced by feature engineering

---

## 6. Exploratory Data Analysis (EDA)
- [ ] Univariate: distribution of target variable
- [ ] Univariate: distribution of key numeric features
- [ ] Bivariate: target vs each major feature (scatter, boxplot, groupby mean)
- [ ] Correlation matrix / heatmap for numeric features
- [ ] Category-wise breakdown (target by group, e.g. price by locality)
- [ ] Geo/time plots if applicable
- [ ] Write down 3-5 observations in plain language, not just charts

> [!warning] A chart without a written takeaway is decoration, not analysis. Always caption what you see.

---

## 7. Modeling (if applicable)
- [ ] Confirm dataset size is sufficient for modeling (rule of thumb: 10x rows per feature, minimum)
- [ ] Baseline model first (linear/logistic regression), establish a benchmark
- [ ] Train/test split, watch for temporal leakage if data has a time component
- [ ] Try a tree-based model (Random Forest / XGBoost) for feature importance
- [ ] Evaluate with appropriate metric (RMSE, MAE, R² for regression; F1/AUC for classification)
- [ ] Check residuals, not just the headline metric
- [ ] Document which features actually mattered vs assumed

---

## 8. Validation & Sanity Checks
- [ ] Do the top features make domain sense?
- [ ] Cross-check a few predictions manually against known cases
- [ ] Check for data leakage (is a feature secretly encoding the target?)
- [ ] Re-run on a fresh data slice if possible

---

## 9. Communication / Dashboard
- [ ] Pick the right tool for the audience (PowerBI, Streamlit, static report)
- [ ] Lead with the answer, not the methodology
- [ ] Limit to 3-5 key visuals per view, avoid clutter
- [ ] Add filters only where they change the decision, not just because you can
- [ ] Include a caveats/limitations section (sample size, data recency, scope)

---

## 10. Wrap-up
- [ ] Save final cleaned dataset + notebook together
- [ ] Note what you'd do differently / what's missing from the data
- [ ] Log next steps for v2 (more data, more features, better model)

---

## 🔗 Related
- [[pandas]]
- [[Sklearn|Scikit-learn]]
- [[PowerBI]]
