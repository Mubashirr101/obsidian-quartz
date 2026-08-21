---
title: Data Analysis Notebook Template
tags: [template, workflow, data-science, python]
created: 2026-08-21
---

# 📓 Data Analysis Notebook Template

> [!note] Copy this structure into a new .ipynb when starting a project. Each section below is one notebook cell block, in the order you'd actually run them.

---

## Setup

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

sns.set_style('whitegrid')
pd.set_option('display.max_columns', None)
pd.set_option('display.width', 200)
```

---

## 1. Load data

```python
data = pd.read_csv("data/raw/FILENAME.csv")
data.head()
```

```python
print(f"shape: {data.shape}")
data.info()
```

---

## 2. Select needed columns

```python
# dump full column list once, reference it when picking cols
with open('colnames.txt', 'w') as f:
    for c in data.columns:
        f.write(f"{c}\n")
```

```python
cols_to_keep = [
    # paste relevant column names here
]
existing_cols = [c for c in cols_to_keep if c in data.columns]
df = data[existing_cols].copy()
df.head()
```

---

## 3. Data quality check

```python
null_pct = (df.isnull().sum() / len(df) * 100).sort_values(ascending=False)
null_pct[null_pct > 0]
```

```python
# drop columns too sparse to be useful given row count
high_missing = null_pct[null_pct > 70].index.tolist()
print("dropping:", high_missing)
df = df.drop(columns=high_missing)
```

```python
# quick sanity checks
for c in df.select_dtypes(include='object').columns:
    print(c, '->', df[c].unique()[:10])
```

---

## 4. Cleaning

```python
# dtype fixes go here, examples:

# df['col'] = pd.to_numeric(df['col'], errors='coerce')
# df['date_col'] = pd.to_datetime(df['date_col'], errors='coerce')
# df['col'] = df['col'].replace({'BadValue': 'CleanValue'})
```

```python
# dedupe
before = len(df)
df = df.drop_duplicates()
print(f"dropped {before - len(df)} duplicate rows")
```

---

## 5. Feature engineering

```python
# ratios, derived fields, encodings go here, examples:

# df['price_per_unit'] = df['price'] / df['area']
# df['days_since'] = (pd.Timestamp.now() - df['date_col']).dt.days
# ordinal_map = {'Low': 0, 'Medium': 1, 'High': 2}
# df['col_ord'] = df['col'].map(ordinal_map)
```

---

## 6. EDA

```python
df.describe()
```

```python
# target distribution
fig, ax = plt.subplots(figsize=(7, 4))
sns.histplot(df['TARGET_COL'], bins=20, kde=True, ax=ax)
ax.set_title('Target distribution')
plt.tight_layout()
plt.show()
```

```python
# target vs key feature
fig, ax = plt.subplots(figsize=(7, 4))
sns.scatterplot(data=df, x='FEATURE_COL', y='TARGET_COL', ax=ax)
plt.tight_layout()
plt.show()
```

```python
# target by category
grouped = df.groupby('CATEGORY_COL')['TARGET_COL'].agg(['mean', 'count']).sort_values('mean', ascending=False)
grouped
```

```python
# correlation heatmap
numeric_cols = df.select_dtypes(include=np.number).columns
corr = df[numeric_cols].corr()

fig, ax = plt.subplots(figsize=(8, 6))
sns.heatmap(corr, annot=True, fmt='.2f', cmap='coolwarm', center=0, ax=ax)
plt.tight_layout()
plt.show()
```

> [!tip] Write 3-5 takeaways in a markdown cell right after this. What's driving the target, what's surprising, what needs more data.

---

## 7. Modeling

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

features = ['FEATURE_1', 'FEATURE_2']  # fill in
X = df[features]
y = df['TARGET_COL']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
preds = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, preds))
print("R2:", r2_score(y_test, preds))
```

```python
# feature importance via tree model
from sklearn.ensemble import RandomForestRegressor

rf = RandomForestRegressor(random_state=42)
rf.fit(X_train, y_train)

importance = pd.Series(rf.feature_importances_, index=features).sort_values(ascending=False)
importance
```

---

## 8. Save outputs

```python
df.to_csv("data/processed/cleaned_dataset.csv", index=False)
print(f"saved -> {df.shape}")
```

---

## 🔗 Related
- [[data-analysis-roadmap]]
- [[pandas]]
- [[Sklearn|Scikit-learn]]
