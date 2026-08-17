---
title: Preprocessing & Scaling
tags: [sklearn, python, preprocessing, scaling, encoding]
aliases: [StandardScaler, OneHotEncoder, SimpleImputer]
---

# Preprocessing & Scaling

> [!abstract] Definition
> The `sklearn.preprocessing` and `sklearn.impute` modules transform raw features into a form suitable for modeling: scaling numeric ranges, encoding categorical variables, and filling missing values.

---

## Feature Scaling

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, Normalizer

scaler = StandardScaler()               # zero mean, unit variance: (x - mean) / std
X_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)  # use TRAIN-fitted scaler on test data — never re-fit!

MinMaxScaler(feature_range=(0, 1))        # scales to a fixed range, e.g. [0, 1]
RobustScaler()                              # uses median/IQR — robust to outliers
Normalizer(norm="l2")                         # scales each ROW (sample) to unit norm, not columns
```

| Scaler | Formula | Best for |
|---|---|---|
| `StandardScaler` | `(x - mean) / std` | general default; assumes roughly Gaussian features |
| `MinMaxScaler` | `(x - min) / (max - min)` | bounded range needed (e.g. neural nets, image pixels) |
| `RobustScaler` | `(x - median) / IQR` | data with outliers |
| `Normalizer` | scales each sample to unit norm | text/TF-IDF vectors, direction-sensitive models |

> [!warning] Fit scalers on training data ONLY
> `scaler.fit_transform(X_train)` then `scaler.transform(X_test)` — never call `.fit()` on test data, or you leak test-set statistics into the model (data leakage). See [[Machine Learning/Libraries/ML/sklearn/17-Common-Errors-Gotchas]].

---

## Categorical Encoding

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, LabelEncoder

ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
X_encoded = ohe.fit_transform(X[["city"]])
ohe.get_feature_names_out()          # ['city_Mumbai', 'city_Pune', ...]

OrdinalEncoder()                       # encodes categories as integers 0,1,2,... (assumes/implies order!)
LabelEncoder()                           # for encoding the TARGET y, not features
```

| Encoder | Use case |
|---|---|
| `OneHotEncoder` | nominal categories, no inherent order (city, color) |
| `OrdinalEncoder` | ordinal categories with meaningful order (Low/Medium/High) — or feeding tree models, which don't need one-hot |
| `LabelEncoder` | encoding the **target** `y` for classification, not feature columns |

> [!tip] Tree-based models don't require one-hot encoding
> Random Forests/Gradient Boosting can split on ordinal-encoded or even raw integer-coded categoricals reasonably well; linear models and distance-based models (KNN, SVM) generally need one-hot encoding.

---

## Handling Missing Values (Imputation)

```python
from sklearn.impute import SimpleImputer, KNNImputer

SimpleImputer(strategy="mean")           # fill with column mean (numeric)
SimpleImputer(strategy="median")           # robust to outliers
SimpleImputer(strategy="most_frequent")      # mode — works for categorical too
SimpleImputer(strategy="constant", fill_value=0)

imputer = SimpleImputer(strategy="median")
X_imputed = imputer.fit_transform(X_train)

KNNImputer(n_neighbors=5)                  # impute using values from nearest neighbors
```

---

## Polynomial & Interaction Features

```python
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)     # adds x1^2, x2^2, x1*x2, etc.
```

---

## Binning / Discretization

```python
from sklearn.preprocessing import KBinsDiscretizer

kbd = KBinsDiscretizer(n_bins=5, encode="ordinal", strategy="quantile")
X_binned = kbd.fit_transform(X[["age"]])
```

---

## Function Transformer (Custom Transformations)

```python
from sklearn.preprocessing import FunctionTransformer
import numpy as np

log_transformer = FunctionTransformer(np.log1p)
X_log = log_transformer.fit_transform(X)
```

---

## Target Transformation (Regression)

```python
from sklearn.compose import TransformedTargetRegressor
from sklearn.linear_model import LinearRegression
import numpy as np

model = TransformedTargetRegressor(
    regressor=LinearRegression(),
    func=np.log1p, inverse_func=np.expm1     # model learns on log(y), predictions un-transformed automatically
)
```

---

## Related
- [[04-Pipelines-ColumnTransformer]]
- [[05-Missing-Data|Pandas: Missing Data]]
- [[Machine Learning/Libraries/ML/sklearn/17-Common-Errors-Gotchas]]
