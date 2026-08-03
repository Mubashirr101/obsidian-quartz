---
title: Common Errors & Gotchas
tags: [sklearn, python, debugging, gotchas, data-leakage]
aliases: [data leakage, NotFittedError, sklearn errors]
---

# Common Errors & Gotchas

> [!abstract] Purpose
> A troubleshooting reference for the mistakes and errors that come up most often when working with scikit-learn — many are conceptual (data leakage) rather than syntax errors, and are far more damaging because the code runs fine but produces misleadingly optimistic results.

---

## Data Leakage — The #1 Silent Killer

```python
# BAD — scaler sees the ENTIRE dataset, including test data, before splitting
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)             # leaks test-set statistics into training
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y)

# GOOD — split FIRST, fit scaler ONLY on training data
X_train, X_test, y_train, y_test = train_test_split(X, y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)          # transform only, never fit again
```

> [!warning] Why this matters
> Fitting any preprocessing step (scaler, imputer, feature selector, encoder) on data that includes the test set means the test set is no longer a true "unseen data" evaluation — reported performance will be optimistically biased and won't reflect real-world generalization.

> [!tip] The fix: always use a Pipeline
> Wrapping preprocessing + model in a [[04-Pipelines-ColumnTransformer|Pipeline]] and passing the WHOLE pipeline to `train_test_split`/`cross_val_score`/`GridSearchCV` makes leakage structurally impossible — each fold refits preprocessing only on that fold's training portion.

---

## `NotFittedError`

```python
model = LogisticRegression()
model.predict(X_test)     # NotFittedError — .fit() was never called
```

> Always call `.fit()` before `.predict()`/`.transform()`. If using a saved model, confirm `joblib.load()` actually returned a fitted object (check for attributes ending in `_`, e.g. `model.coef_`).

---

## Shape Mismatches — 1D vs 2D

```python
model.fit(df["feature"], y)         # ValueError — Series is 1D, sklearn expects 2D X
model.fit(df[["feature"]], y)         # correct — double brackets keep it a DataFrame (2D)

model.fit(X, y_2d_array)                # warning/error if y has shape (n,1) instead of (n,)
model.fit(X, y.values.ravel())            # flatten to 1D if needed
```

---

## Categorical Data Not Encoded

```python
model.fit(X, y)     # ValueError: could not convert string to float
```

> Most sklearn estimators require purely numeric input. Encode categorical columns first — see [[02-Preprocessing-Scaling]] for `OneHotEncoder`/`OrdinalEncoder`, ideally within a [[04-Pipelines-ColumnTransformer|ColumnTransformer]].

---

## Forgetting `handle_unknown="ignore"` on OneHotEncoder

```python
ohe = OneHotEncoder()                          # default: errors on unseen categories at transform time
ohe = OneHotEncoder(handle_unknown="ignore")     # unseen categories -> all-zero row instead of crashing
```

> If production/test data contains a category not seen during training (e.g. a new city name), the default `OneHotEncoder` raises an error at `.transform()` time — `handle_unknown="ignore"` avoids this by encoding unseen categories as all zeros.

---

## Mismatched Feature Order/Names Between Train and Predict

```python
model.fit(X_train[["age", "income"]], y_train)
model.predict(X_test[["income", "age"]])    # WRONG ORDER — silently produces garbage predictions in older sklearn
```

> [!tip] Modern sklearn (≥1.0) checks feature names
> If `X_train` was a DataFrame, sklearn stores `feature_names_in_` and will raise a warning/error if `.predict()` receives differently-ordered or differently-named columns — but always double-check when working with raw NumPy arrays, where no such check exists.

---

## Class Imbalance Ignored

```python
model = LogisticRegression()      # default: treats all classes equally, biased toward majority class
model = LogisticRegression(class_weight="balanced")   # auto-adjusts for imbalance
```

> Evaluate with precision/recall/F1 (see [[11-Model-Evaluation-Metrics]]), not just accuracy, on imbalanced datasets.

---

## `ConvergenceWarning`

```python
# LogisticRegression, MLPClassifier, etc. — didn't converge within max_iter
model = LogisticRegression(max_iter=1000)   # increase from the default (100)
```

> Also consider scaling features first — unscaled data often causes slow/failed convergence in gradient-based solvers.

---

## Refitting the Vectorizer/Scaler on Test Data

```python
tfidf.fit_transform(X_test_text)      # WRONG — creates a DIFFERENT vocabulary than training
tfidf.transform(X_test_text)            # CORRECT — reuses the training-fitted vocabulary
```

---

## Cross-Validation Score Looks "Too Good"

> [!warning] Suspiciously high CV scores usually mean leakage
> Common causes: preprocessing fit before splitting, duplicate rows across train/test, a feature that's a proxy for or directly derived from the target (e.g. accidentally including a post-outcome column), or time-series data split randomly instead of chronologically (use `TimeSeriesSplit`).

---

## Comparing Floats / Random State Confusion

```python
model1 = RandomForestClassifier(random_state=42)
model2 = RandomForestClassifier(random_state=42)
# Same random_state + same data + same params = reproducible identical results — useful for debugging
```

---

## Related
- [[02-Preprocessing-Scaling]]
- [[03-Train-Test-Split-Cross-Validation]]
- [[04-Pipelines-ColumnTransformer]]
- [[11-Model-Evaluation-Metrics]]
