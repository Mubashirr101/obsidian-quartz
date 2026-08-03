---
title: Neural Networks — MLP
tags: [sklearn, python, neural-networks, mlp]
aliases: [MLPClassifier, MLPRegressor]
---

# Neural Networks — Multi-Layer Perceptron (MLP)

> [!abstract] Definition
> `sklearn.neural_network` provides a basic feedforward neural network implementation — `MLPClassifier`/`MLPRegressor` — suitable for small-to-medium problems. For serious deep learning (CNNs, RNNs, transformers, GPU training), use dedicated frameworks like **PyTorch** or **TensorFlow/Keras** instead.

---

## MLPClassifier

```python
from sklearn.neural_network import MLPClassifier

model = MLPClassifier(
    hidden_layer_sizes=(100,),     # one hidden layer with 100 neurons; (64, 32) = two layers
    activation="relu",               # 'relu' | 'tanh' | 'logistic' | 'identity'
    solver="adam",                     # 'adam' (default, good general choice) | 'sgd' | 'lbfgs' (small datasets)
    alpha=0.0001,                        # L2 regularization strength
    learning_rate_init=0.001,              # initial learning rate (for adam/sgd)
    max_iter=500,                            # max training epochs — increase if convergence warning appears
    early_stopping=True,                       # stop training when validation score stops improving
    random_state=42
)
model.fit(X_train, y_train)
model.predict(X_test)
model.predict_proba(X_test)
model.loss_curve_             # training loss per iteration — useful for diagnosing convergence
```

---

## MLPRegressor

```python
from sklearn.neural_network import MLPRegressor

model = MLPRegressor(
    hidden_layer_sizes=(64, 32),
    activation="relu",
    solver="adam",
    max_iter=1000,
    early_stopping=True,
    random_state=42
)
model.fit(X_train, y_train)
```

---

## Feature Scaling is Mandatory

```python
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

nn_pipe = make_pipeline(StandardScaler(), MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=500))
nn_pipe.fit(X_train, y_train)
```

> [!warning] Neural networks are highly sensitive to unscaled features
> Gradient-based optimization (adam/sgd) converges poorly or not at all on unscaled data — always scale features first, without exception.

---

## Diagnosing Training

```python
import matplotlib.pyplot as plt
plt.plot(model.loss_curve_)
plt.xlabel("Iteration"); plt.ylabel("Loss")
```

> [!tip] Convergence warnings
> `ConvergenceWarning: ... increase max_iter` means training stopped before the loss plateaued — either increase `max_iter`, adjust `learning_rate_init`, or check that features are properly scaled.

---

## Key Hyperparameters to Tune

| Parameter | Effect |
|---|---|
| `hidden_layer_sizes` | model capacity — more/larger layers = more capacity, more overfitting risk |
| `alpha` | L2 regularization — higher = simpler model, less overfitting |
| `learning_rate_init` | step size — too high overshoots, too low trains slowly |
| `early_stopping` | halts training using a held-out validation split — helps prevent overfitting |
| `batch_size` | mini-batch size for solvers 'adam'/'sgd' |

---

## When to Use `MLPClassifier`/`Regressor` vs a Real Deep Learning Framework

> [!info] sklearn's MLP is appropriate for
> - Small-to-medium tabular datasets
> - Quick experimentation without setting up a separate DL framework
> - CPU-only environments, no GPU acceleration needed
>
> **Switch to PyTorch/TensorFlow when you need:** GPU acceleration, convolutional/recurrent/transformer architectures, custom loss functions, transfer learning, or training on large datasets (images, text sequences, audio).

---

## Related
- [[02-Preprocessing-Scaling]]
- [[12-Hyperparameter-Tuning]]
- [[11-Model-Evaluation-Metrics]]
