---
title: Random Module
tags: [numpy, python, random, sampling]
aliases: [np.random, Generator, seed]
---

# Random Module

> [!abstract] Definition
> NumPy's `random` module generates pseudo-random numbers from various distributions. Modern code should use the **Generator API** (`np.random.default_rng()`), which is faster and statistically improved over the legacy global-state functions (`np.random.seed()`, `np.random.rand()`, etc.), though both still work.

---

## Modern API — `Generator` (Recommended)

```python
rng = np.random.default_rng(seed=42)     # create a seeded generator

rng.random(5)                     # 5 floats in [0, 1)
rng.random((2, 3))                  # 2D array of floats in [0, 1)
rng.integers(0, 10, size=5)           # 5 random integers in [0, 10)
rng.integers(0, 10, size=5, endpoint=True)  # inclusive of 10

rng.normal(loc=0, scale=1, size=5)      # 5 samples from N(0, 1)
rng.uniform(low=0, high=10, size=5)       # 5 samples, uniform distribution

rng.choice([1, 2, 3, 4, 5], size=3)         # random sample (with replacement by default)
rng.choice([1, 2, 3, 4, 5], size=3, replace=False)  # without replacement
rng.choice(["a", "b", "c"], size=5, p=[0.1, 0.3, 0.6])  # weighted sampling

rng.shuffle(arr)              # shuffle in place
rng.permutation(arr)            # return a shuffled COPY, original untouched
```

> [!tip] Reproducibility
> Always pass a `seed` to `default_rng()` in analysis/ML code so results are reproducible: `rng = np.random.default_rng(42)`.

---

## Legacy API — Global State (Still Common in Older Code)

```python
np.random.seed(42)              # sets the global random state

np.random.rand(5)                  # 5 floats in [0, 1), uniform
np.random.rand(2, 3)                 # 2D array
np.random.randn(5)                     # 5 floats from standard normal N(0,1)
np.random.randint(0, 10, size=5)         # random integers, exclusive of upper bound
np.random.choice([1, 2, 3], size=3)        # random sample
np.random.shuffle(arr)                       # shuffle in place
```

> [!warning] Legacy API uses global mutable state
> Calling `np.random.seed()` affects **every** subsequent call anywhere in the program — this can cause subtle bugs in larger codebases (e.g. library code re-seeding unexpectedly). The `Generator` API avoids this by keeping state in an explicit object you pass around.

---

## Common Distributions (Generator API)

```python
rng.normal(loc=0, scale=1, size=1000)         # Gaussian/Normal
rng.uniform(low=0, high=1, size=1000)           # Uniform
rng.binomial(n=10, p=0.5, size=1000)              # Binomial
rng.poisson(lam=3, size=1000)                       # Poisson
rng.exponential(scale=1.0, size=1000)                 # Exponential
rng.beta(a=2, b=5, size=1000)                           # Beta
rng.gamma(shape=2, scale=2, size=1000)                    # Gamma
```

---

## Reproducible Train/Test Splits (Common ML Pattern)

```python
rng = np.random.default_rng(42)
indices = rng.permutation(len(X))
split = int(0.8 * len(X))
train_idx, test_idx = indices[:split], indices[split:]
X_train, X_test = X[train_idx], X[test_idx]
```

> [!info] For actual ML workflows, prefer `sklearn.model_selection.train_test_split(random_state=42)` — this manual pattern is mainly useful for understanding what happens under the hood.

---

## Setting Array Values Randomly (Simulation Use Case)

```python
grid = rng.integers(0, 2, size=(10, 10))    # random binary grid, e.g. for a simulation
noise = rng.normal(0, 0.1, size=data.shape)   # add Gaussian noise to existing data
noisy_data = data + noise
```

---

## Related
- [[04-Math-Statistical-Functions]]
- [[06-Linear-Algebra]]
- ML Study Notes — train/test splitting, sampling
