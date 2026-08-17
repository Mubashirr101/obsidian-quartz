---
title: Linear Models
tags: [sklearn, python, linear-regression, logistic-regression, regularization]
aliases: [LinearRegression, LogisticRegression, Ridge, Lasso]
---

# Linear Models

> [!abstract] Definition
> Linear models predict a target as a weighted sum of input features. `sklearn.linear_model` covers regression (`LinearRegression`, `Ridge`, `Lasso`, `ElasticNet`) and classification (`LogisticRegression`) variants, including regularized versions that penalize large coefficients to reduce overfitting.

---

## Linear Regression

```python
from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

model.coef_          # learned weight per feature
model.intercept_        # learned bias term
model.predict(X_test)
model.score(X_test, y_test)   # R² score
```

> [!info] Underlying math
> Fits by minimizing the sum of squared residuals (Ordinary Least Squares). See ML Study Notes — [[Cost Function|Cost Function]] for the derivation.

---

## Regularized Regression — Ridge, Lasso, ElasticNet

```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet

Ridge(alpha=1.0)                      # L2 penalty — shrinks coefficients toward 0, keeps all features
Lasso(alpha=1.0)                        # L1 penalty — can shrink coefficients to EXACTLY 0 (feature selection)
ElasticNet(alpha=1.0, l1_ratio=0.5)       # mix of L1 + L2
```

| Model | Penalty | Effect |
|---|---|---|
| `Ridge` | L2 (sum of squared coefficients) | shrinks all coefficients smoothly, none reach exactly 0 |
| `Lasso` | L1 (sum of absolute coefficients) | can zero out coefficients entirely — automatic feature selection |
| `ElasticNet` | mix of L1 + L2 | balances both effects, useful when features are correlated |

> [!tip] `alpha` controls regularization strength
> Higher `alpha` = stronger penalty = simpler model (more bias, less variance). Tune via [[12-Hyperparameter-Tuning|GridSearchCV]] or use the built-in CV variants: `RidgeCV`, `LassoCV`, `ElasticNetCV` (automatically find the best `alpha`).

```python
from sklearn.linear_model import RidgeCV
model = RidgeCV(alphas=[0.1, 1.0, 10.0], cv=5)
model.fit(X_train, y_train)
model.alpha_    # the alpha that performed best
```

> [!warning] Always scale features before regularized regression
> L1/L2 penalties treat all coefficients on the same scale — unscaled features with larger numeric ranges get penalized unfairly. Use `StandardScaler` first, ideally within a [[04-Pipelines-ColumnTransformer|Pipeline]].

---

## Logistic Regression (Classification, Despite the Name)

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression(
    penalty="l2",          # 'l1' | 'l2' | 'elasticnet' | None
    C=1.0,                    # inverse of regularization strength — SMALLER C = STRONGER regularization
    solver="lbfgs",             # optimization algorithm; 'liblinear' for small data + L1, 'saga' for large/elasticnet
    max_iter=1000,                # increase if convergence warning appears
    multi_class="auto"              # handles multi-class automatically (one-vs-rest or multinomial)
)

model.fit(X_train, y_train)
model.predict(X_test)                # class labels
model.predict_proba(X_test)            # class probabilities
model.coef_                              # log-odds coefficients per feature
```

> [!warning] `C` is the INVERSE of regularization strength
> Unlike `alpha` in Ridge/Lasso, smaller `C` in LogisticRegression means stronger regularization — an easy mix-up.

---

## Polynomial Regression (Linear Model on Engineered Features)

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline

poly_model = make_pipeline(
    PolynomialFeatures(degree=3),
    LinearRegression()
)
poly_model.fit(X_train, y_train)
```

> [!info] "Polynomial Regression" is still a linear model
> It's linear in the **coefficients** — the nonlinearity comes entirely from the engineered polynomial feature columns, not the model itself.

---

## Stochastic Gradient Descent Variants (Large-Scale Data)

```python
from sklearn.linear_model import SGDRegressor, SGDClassifier

SGDRegressor(loss="squared_error", penalty="l2", max_iter=1000)
SGDClassifier(loss="log_loss", penalty="l2")   # log_loss = logistic regression via SGD
```

> [!tip] Use SGD variants for very large datasets
> `LinearRegression`/`LogisticRegression` solve exactly (or via full-batch optimization) and can be slow/memory-heavy on huge datasets. `SGDRegressor`/`SGDClassifier` process data in mini-batches, making them far more scalable.

---

## Related
- [[02-Preprocessing-Scaling]]
- [[11-Model-Evaluation-Metrics]]
- [[13-Feature-Selection]]
- ML Study Notes — [[Cost Function]], [[Linear Regression]]
