---
title: Text Feature Extraction
tags: [sklearn, python, nlp, text, tfidf]
aliases: [CountVectorizer, TfidfVectorizer, bag of words]
---

# Text Feature Extraction

> [!abstract] Definition
> `sklearn.feature_extraction.text` converts raw text into numeric feature matrices that models can consume — via **Bag of Words** (`CountVectorizer`) or **TF-IDF** (`TfidfVectorizer`) weighting, producing sparse matrices suitable for classification, clustering, or search.

---

## `CountVectorizer` — Bag of Words

```python
from sklearn.feature_extraction.text import CountVectorizer

corpus = ["the cat sat on the mat", "the dog sat on the log"]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(corpus)      # sparse matrix, shape (n_docs, n_vocab)

vectorizer.get_feature_names_out()          # ['cat', 'dog', 'log', 'mat', 'on', 'sat', 'the']
X.toarray()                                    # dense view — each row = word counts per document
```

### Key Parameters

```python
CountVectorizer(
    lowercase=True,             # normalize case
    stop_words="english",         # remove common words (the, a, is, ...)
    ngram_range=(1, 2),             # include unigrams AND bigrams, e.g. "cat sat"
    max_features=5000,                # keep only the top N most frequent terms
    min_df=2,                           # ignore terms appearing in fewer than 2 documents
    max_df=0.95,                          # ignore terms appearing in more than 95% of documents (too common)
    token_pattern=r"(?u)\b\w\w+\b"          # regex defining what counts as a "token"
)
```

---

## `TfidfVectorizer` — Term Frequency-Inverse Document Frequency

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
X_tfidf = tfidf.fit_transform(corpus)
```

> [!info] Why TF-IDF instead of raw counts
> TF-IDF down-weights words that appear frequently across **all** documents (like "the", "sat") and up-weights words that are distinctive to a **specific** document — generally produces better features for classification/search than raw word counts.

**Formula intuition:**
`TF-IDF(term, doc) = TermFrequency(term, doc) × log(TotalDocs / DocsContainingTerm)`

---

## `TfidfTransformer` (Apply TF-IDF to Existing Counts)

```python
from sklearn.feature_extraction.text import TfidfTransformer

# Useful if you already have counts (e.g. from CountVectorizer) and want to apply TF-IDF weighting separately
counts = CountVectorizer().fit_transform(corpus)
tfidf = TfidfTransformer().fit_transform(counts)
```

> [!tip] `TfidfVectorizer` = `CountVectorizer` + `TfidfTransformer` combined
> Use `TfidfVectorizer` directly unless you specifically need the raw counts as an intermediate step too.

---

## Applying to a New Model Pipeline

```python
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import LogisticRegression

text_pipe = make_pipeline(
    TfidfVectorizer(stop_words="english", max_features=5000),
    LogisticRegression(max_iter=1000)
)
text_pipe.fit(X_train_text, y_train)
text_pipe.predict(["a brand new document to classify"])
```

---

## Transforming New/Unseen Text

```python
vectorizer.transform(new_texts)      # use the SAME fitted vectorizer — never call fit_transform on test data
```

> [!warning] Never re-fit the vectorizer on test data
> Just like scalers, the vectorizer's vocabulary must be learned only from training data. New words in test data not seen during `.fit()` are simply ignored at transform time — this is expected behavior, not a bug.

---

## Working with Sparse Output

```python
X.shape          # (n_docs, n_vocab) — often very wide, mostly zeros
X.toarray()        # convert to dense NumPy array — only for small vocabularies, memory-expensive otherwise
type(X)               # scipy.sparse matrix — most sklearn models accept this directly, no need to densify
```

> [!tip] Keep text features sparse
> Most sklearn estimators (LogisticRegression, LinearSVC, MultinomialNB) accept sparse matrices directly and are optimized for them — converting to dense with `.toarray()` on a large vocabulary can exhaust memory unnecessarily.

---

## Dimensionality Reduction on Text (For Dense Downstream Models)

```python
from sklearn.decomposition import TruncatedSVD

svd = TruncatedSVD(n_components=100)
X_reduced = svd.fit_transform(X_tfidf)     # "Latent Semantic Analysis" (LSA) — see 10-Dimensionality-Reduction
```

---

## Related
- [[08-KNN-Naive-Bayes]]
- [[10-Dimensionality-Reduction]]
- [[09-String-Methods|Pandas: String Methods]]
