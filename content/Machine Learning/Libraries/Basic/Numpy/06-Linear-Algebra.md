---
title: Linear Algebra
tags: [numpy, python, linear-algebra, matrix]
aliases: [np.linalg, matmul, dot product]
---

# Linear Algebra

> [!abstract] Definition
> The **`numpy.linalg`** module provides matrix decomposition, solving, and other linear algebra operations, built on optimized BLAS/LAPACK routines. Core matrix multiplication (`dot`, `matmul`, `@`) lives at the top level of NumPy.

---

## Matrix Multiplication

```python
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])

a @ b                  # matrix multiplication (preferred, Python 3.5+ syntax)
np.matmul(a, b)           # equivalent to @
np.dot(a, b)                # also equivalent for 2D arrays

np.dot(vec1, vec2)            # for 1D arrays, this is the dot (inner) product -> scalar
np.outer(vec1, vec2)            # outer product -> matrix
```

> [!warning] `*` is element-wise, not matrix multiplication
> `a * b` multiplies element-by-element (requires matching/broadcastable shapes). Use `a @ b` or `np.matmul(a, b)` for true matrix multiplication.

---

## Transpose & Inverse

```python
a.T                          # transpose
np.linalg.inv(a)               # matrix inverse (a must be square and non-singular)
np.linalg.pinv(a)                # Moore-Penrose pseudo-inverse (works for non-square/singular)
```

---

## Determinant, Rank, Trace

```python
np.linalg.det(a)         # determinant
np.linalg.matrix_rank(a)   # rank
np.trace(a)                  # sum of diagonal elements
```

---

## Solving Linear Systems (Ax = b)

```python
A = np.array([[3, 1], [1, 2]])
b = np.array([9, 8])

x = np.linalg.solve(A, b)     # solves Ax = b directly — more stable/faster than inv(A) @ b
```

> [!tip] Prefer `np.linalg.solve()` over `np.linalg.inv(A) @ b`
> Explicitly computing the inverse is numerically less stable and slower than solving the system directly.

---

## Eigenvalues & Eigenvectors

```python
eigenvalues, eigenvectors = np.linalg.eig(a)
eigenvalues_symmetric = np.linalg.eigvalsh(a)   # faster, for symmetric/Hermitian matrices
```

---

## Norms

```python
np.linalg.norm(vec)                   # Euclidean (L2) norm by default
np.linalg.norm(vec, ord=1)               # L1 norm (sum of absolute values)
np.linalg.norm(vec, ord=np.inf)            # max absolute value
np.linalg.norm(matrix, axis=1)               # row-wise norms for a 2D array
```

---

## Decompositions

```python
Q, R = np.linalg.qr(a)                     # QR decomposition
U, S, Vt = np.linalg.svd(a)                  # Singular Value Decomposition
L = np.linalg.cholesky(a)                      # Cholesky (a must be positive-definite)
```

---

## Identity & Diagonal Matrices

```python
np.eye(3)                    # 3x3 identity matrix
np.diag([1, 2, 3])              # construct a diagonal matrix from a vector
np.diag(matrix)                   # extract the diagonal from an existing matrix
```

---

## Practical ML Context

```python
# Linear regression normal equation: theta = (X^T X)^-1 X^T y
theta = np.linalg.inv(X.T @ X) @ X.T @ y

# Better: use lstsq, which is more numerically stable and handles non-square/singular X
theta, residuals, rank, sv = np.linalg.lstsq(X, y, rcond=None)
```

> [!tip] For regression problems, prefer `np.linalg.lstsq()` over manually inverting `X.T @ X`
> `lstsq` handles rank-deficient or ill-conditioned matrices gracefully, which the manual inverse formula does not.

---

## Related
- [[03-Broadcasting-Operations]]
- [[04-Math-Statistical-Functions]]
- ML Study Notes — Cost Function, Linear Regression
