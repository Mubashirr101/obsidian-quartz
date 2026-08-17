---
title: Hyperparameter Tuning
tags: [sklearn, python, hyperparameter-tuning, gridsearch]
aliases: [GridSearchCV, RandomizedSearchCV, learning curve]
---

# Hyperparameter Tuning

> [!abstract] Definition
> Hyperparameter tuning systematically searches over combinations of model settings (not learned from data, but set beforehand) to find the combination that performs best under cross-validation.

---

## `GridSearchCV` — Exhaustive Search

```python
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

param_grid = {
    "n_estimators": [100, 200, 300],
    "max_depth": [None, 10, 20, 30],
    "min_samples_split": [2, 5, 10]
}

grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,                      # 5-fold cross-validation for each combination
    scoring="f1_weighted",
    n_jobs=-1,                   # parallelize across all CPU cores
    verbose=1
)
grid.fit(X_train, y_train)

grid.best_params_             # the winning combination
grid.best_score_                # its CV score
grid.best_estimator_              # a fitted model with the best params, ready to use
grid.predict(X_test)                # GridSearchCV itself can predict directly (uses best_estimator_)
```

> [!warning] Grid search scales combinatorially
> 3 params × 4 values × 3 values × 5-fold CV = 3×4×3×5 = 180 model fits. Grid search gets expensive fast with many hyperparameters — consider `RandomizedSearchCV` for larger search spaces.

---

## `RandomizedSearchCV` — Sample a Fixed Number of Combinations

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform

param_dist = {
    "n_estimators": randint(50, 500),
    "max_depth": randint(3, 50),
    "min_samples_split": randint(2, 20),
    "max_features": uniform(0.1, 0.9)
}

random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=50,               # only try 50 random combinations, not all possible
    cv=5,
    scoring="f1_weighted",
    random_state=42,
    n_jobs=-1
)
random_search.fit(X_train, y_train)
```

> [!tip] `RandomizedSearchCV` is usually more efficient
> With many hyperparameters, random search often finds near-optimal combinations faster than exhaustive grid search, because it doesn't waste evaluations on unpromising regions of low-impact parameters.

---

## Tuning a Full Pipeline

```python
param_grid = {
    "model__C": [0.1, 1, 10],                        # "stepname__paramname" syntax
    "preprocessor__num__imputer__strategy": ["mean", "median"]
}
grid = GridSearchCV(full_pipeline, param_grid, cv=5)
grid.fit(X_train, y_train)
```

> [!info] See [[04-Pipelines-ColumnTransformer]] for building the pipeline these parameter names refer to.

---

## Inspecting All Results

```python
import pandas as pd
results = pd.DataFrame(grid.cv_results_)
results[["params", "mean_test_score", "std_test_score"]].sort_values("mean_test_score", ascending=False)
```

---

## Learning Curves — Diagnose Bias vs Variance

```python
from sklearn.model_selection import learning_curve
import matplotlib.pyplot as plt

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 10)
)

plt.plot(train_sizes, train_scores.mean(axis=1), label="Training score")
plt.plot(train_sizes, val_scores.mean(axis=1), label="Validation score")
plt.xlabel("Training set size"); plt.ylabel("Score"); plt.legend()
```

> [!tip] Reading a learning curve
> - **Both curves low, converged** → underfitting (high bias) — try a more complex model or more features
> - **Large gap between curves** → overfitting (high variance) — try regularization, more data, or a simpler model
> - **Both curves high, converged** → good fit

---

## Validation Curves — Tune a Single Hyperparameter

```python
from sklearn.model_selection import validation_curve

param_range = [1, 5, 10, 20, 50, 100]
train_scores, val_scores = validation_curve(
    RandomForestClassifier(random_state=42), X, y,
    param_name="max_depth", param_range=param_range, cv=5
)
```

---

## Bayesian / Advanced Search (External Libraries)

```python
# pip install scikit-optimize
from skopt import BayesSearchCV

opt = BayesSearchCV(model, search_spaces, n_iter=32, cv=5)
```

> [!info] `BayesSearchCV` uses prior results to intelligently choose the next hyperparameter combination to try, rather than sampling randomly or exhaustively — often finds good results with fewer total fits than `RandomizedSearchCV`.

---

## Related
- [[03-Train-Test-Split-Cross-Validation]]
- [[04-Pipelines-ColumnTransformer]]
- [[11-Model-Evaluation-Metrics]]
