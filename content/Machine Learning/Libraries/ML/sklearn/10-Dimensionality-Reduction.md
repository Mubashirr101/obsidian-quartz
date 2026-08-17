---
title: Dimensionality Reduction
tags: [sklearn, python, pca, dimensionality-reduction, tsne]
aliases: [PCA, t-SNE, LDA]
---

# Dimensionality Reduction

> [!abstract] Definition
> Dimensionality reduction compresses high-dimensional data into fewer features while preserving as much meaningful structure as possible — used for visualization, noise reduction, speeding up downstream models, and fighting the curse of dimensionality.

---

## PCA (Principal Component Analysis)

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)          # reduce to 2 dimensions (e.g. for visualization)
X_pca = pca.fit_transform(X_scaled)   # ALWAYS scale features first — PCA is variance-sensitive

pca.explained_variance_ratio_        # % of total variance captured by each component
pca.explained_variance_ratio_.sum()    # total variance retained
pca.components_                          # the principal axes themselves (loadings)
```

```python
# Choosing n_components by desired variance retained, instead of a fixed count
pca = PCA(n_components=0.95)       # keep enough components to explain 95% of variance
X_pca = pca.fit_transform(X_scaled)
pca.n_components_                    # how many components that ended up being
```

> [!warning] Always scale features before PCA
> PCA finds directions of maximum variance — features with larger raw scales dominate the result unless standardized first (`StandardScaler`).

### Scree Plot — Visualize Variance Explained

```python
import matplotlib.pyplot as plt

pca_full = PCA().fit(X_scaled)
plt.plot(range(1, len(pca_full.explained_variance_ratio_) + 1),
          pca_full.explained_variance_ratio_.cumsum(), marker="o")
plt.xlabel("Number of components"); plt.ylabel("Cumulative variance explained")
```

> [!tip] PCA components are unlabeled linear combinations
> Unlike raw features, principal components don't have inherent real-world meaning — they're linear combinations of original features chosen purely to maximize captured variance. Use `pca.components_` to inspect which original features contribute most to each component.

---

## t-SNE (Visualization Only, Not for Modeling)

```python
from sklearn.manifold import TSNE

tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

plt.scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap="viridis")
```

> [!warning] t-SNE is for visualization only
> - No `.transform()` method for new data — must be refit from scratch each time
> - Distances between clusters in the output are **not meaningfully interpretable** (only relative grouping matters)
> - Sensitive to `perplexity` (roughly, "expected number of neighbors") — try several values (5-50)
> - Much slower than PCA, especially on large datasets

---

## UMAP (Not Built Into sklearn, Widely Used Alongside It)

```python
# pip install umap-learn
from umap import UMAP

reducer = UMAP(n_components=2, random_state=42)
X_umap = reducer.fit_transform(X_scaled)
```

> [!info] UMAP vs t-SNE
> UMAP is generally faster, better preserves global structure (not just local clusters), and — unlike t-SNE — supports `.transform()` on new data after fitting.

---

## LDA (Linear Discriminant Analysis) — Supervised Reduction

```python
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

lda = LinearDiscriminantAnalysis(n_components=2)
X_lda = lda.fit_transform(X_scaled, y)     # LDA uses class labels y, unlike PCA
```

> [!info] PCA vs LDA
> PCA is **unsupervised** — maximizes variance without regard to class labels. LDA is **supervised** — maximizes class separability, using `y` during fitting. LDA can also be used directly as a classifier.

---

## Truncated SVD (For Sparse Data, e.g. Text)

```python
from sklearn.decomposition import TruncatedSVD

svd = TruncatedSVD(n_components=100)
X_reduced = svd.fit_transform(X_tfidf)    # works on sparse matrices directly, unlike PCA
```

> [!tip] Use `TruncatedSVD` instead of `PCA` for sparse matrices
> `PCA` centers the data (subtracts the mean), which destroys sparsity and can blow up memory for large sparse matrices like TF-IDF output. `TruncatedSVD` skips centering and works efficiently on sparse input.

---

## Feature Agglomeration (Cluster Features, Not Samples)

```python
from sklearn.cluster import FeatureAgglomeration

agglo = FeatureAgglomeration(n_clusters=10)
X_reduced = agglo.fit_transform(X_scaled)   # groups correlated features together
```

---

## Related
- [[02-Preprocessing-Scaling]]
- [[09-Clustering]]
- [[14-Text-Feature-Extraction]]
