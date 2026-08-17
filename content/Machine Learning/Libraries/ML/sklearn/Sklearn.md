---
title: Scikit-learn
tags:
  - sklearn
  - python
  - moc
  - machine-learning
aliases:
  - sklearn
  - Scikit-learn
  - Scikit-learn Home
created: 2026-08-01
---

# 🤖 Scikit-learn 

> [!abstract] What is scikit-learn?
> **scikit-learn** (`sklearn`) is Python's core general-purpose machine learning library — consistent APIs for preprocessing, supervised/unsupervised models, model selection, and evaluation, all built on top of [[numpy|NumPy]] and interoperable with [[pandas|pandas]] DataFrames.

```python
import sklearn
from sklearn.model_selection import train_test_split
```

> [!info] Version note
> Assumes **scikit-learn ≥ 1.3**. Key modern conventions: `set_output(transform="pandas")` for DataFrame-native pipelines, and consistent `get_feature_names_out()` across transformers.

---

## 📂 Folder Contents

| # | Note | Covers |
|---|------|--------|
| 01 | [[01-Estimator-API-Basics]] | The `fit`/`predict`/`transform` contract, core conventions |
| 02 | [[02-Preprocessing-Scaling]] | Scalers, encoders, imputers |
| 03 | [[03-Train-Test-Split-Cross-Validation]] | `train_test_split`, `KFold`, `cross_val_score` |
| 04 | [[04-Pipelines-ColumnTransformer]] | `Pipeline`, `ColumnTransformer`, `make_pipeline` |
| 05 | [[05-Linear-Models]] | Linear/Logistic Regression, Ridge, Lasso, ElasticNet |
| 06 | [[06-Tree-Ensemble-Models]] | Decision Trees, Random Forest, Gradient Boosting, Voting/Stacking |
| 07 | [[07-SVM]] | Support Vector Machines, kernels |
| 08 | [[08-KNN-Naive-Bayes]] | k-Nearest Neighbors, Naive Bayes variants |
| 09 | [[09-Clustering]] | KMeans, DBSCAN, Hierarchical/Agglomerative |
| 10 | [[10-Dimensionality-Reduction]] | PCA, t-SNE, LDA, feature reduction |
| 11 | [[11-Model-Evaluation-Metrics]] | Classification/regression metrics, confusion matrix |
| 12 | [[12-Hyperparameter-Tuning]] | `GridSearchCV`, `RandomizedSearchCV`, learning curves |
| 13 | [[13-Feature-Selection]] | `SelectKBest`, RFE, feature importance |
| 14 | [[14-Text-Feature-Extraction]] | `CountVectorizer`, `TfidfVectorizer` |
| 15 | [[15-Neural-Networks-MLP]] | `MLPClassifier`/`MLPRegressor` |
| 16 | [[16-Model-Persistence]] | `joblib`, pickling models |
| 17 | [[Machine Learning/Libraries/ML/sklearn/17-Common-Errors-Gotchas]] | Data leakage, scaling order, common `ValueError`s |

---

## 🗺️ Conceptual Map

```mermaid
graph TD
    A[scikit-learn] --> B[Preprocessing]
    A --> C[Model Selection]
    A --> D[Supervised Learning]
    A --> E[Unsupervised Learning]
    A --> F[Evaluation]

    B --> B1[Scalers / Encoders]
    B --> B2[Imputers]
    B --> B3[Pipelines]

    C --> C1[train_test_split]
    C --> C2[Cross-Validation]
    C --> C3[Hyperparameter Tuning]

    D --> D1[Linear Models]
    D --> D2[Tree / Ensemble]
    D --> D3[SVM]
    D --> D4[KNN / Naive Bayes]
    D --> D5[Neural Nets]

    E --> E1[Clustering]
    E --> E2[Dimensionality Reduction]

    F --> F1[Classification Metrics]
    F --> F2[Regression Metrics]
```

---

## ⚡ Quick Reference — Typical Workflow

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

pipe.fit(X_train, y_train)
y_pred = pipe.predict(X_test)

print(accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

---

## 🔗 Related in LORE
- [[pandas|Pandas Reference]] — data loading/cleaning before feeding into sklearn
- [[numpy|NumPy Reference]] — sklearn arrays, math under the hood
- ML Study Notes — Cost Function, Linear Regression theory that these models implement

> [!tip] How to use this vault section
> Same skeleton throughout: **Definition → Syntax → Key Parameters → Examples → Notes/Gotchas**. `Ctrl/Cmd+O` and type "Sklearn" to jump between notes.
