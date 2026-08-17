---
title: Model Persistence
tags: [sklearn, python, joblib, model-deployment]
aliases: [joblib.dump, pickle model, save model]
---

# Model Persistence

> [!abstract] Definition
> Persisting a trained model saves it to disk so it can be reloaded later without retraining — essential for deployment, sharing, or resuming work. scikit-learn recommends **`joblib`** over plain `pickle` for its models, since joblib is more efficient with the large NumPy arrays models typically contain.

---

## Saving & Loading with `joblib` (Recommended)

```python
import joblib

joblib.dump(model, "model.joblib")            # save a fitted model (or full pipeline)
loaded_model = joblib.load("model.joblib")       # load it back, ready to .predict()

joblib.dump(model, "model.joblib.gz", compress=3)  # compressed, smaller file size
```

> [!tip] Save the WHOLE pipeline, not just the model
> If preprocessing (scaler, encoder) was fit as part of a `Pipeline`, save and load the entire pipeline object — not just the final estimator — so predictions on new raw data apply the exact same preprocessing automatically.

```python
from sklearn.pipeline import Pipeline
full_pipe = Pipeline([("scaler", StandardScaler()), ("model", LogisticRegression())])
full_pipe.fit(X_train, y_train)
joblib.dump(full_pipe, "full_pipeline.joblib")

# Later, in production/deployment:
pipe = joblib.load("full_pipeline.joblib")
pipe.predict(new_raw_data)     # scaling + prediction happen automatically
```

---

## Saving & Loading with `pickle` (Alternative)

```python
import pickle

with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("model.pkl", "rb") as f:
    loaded_model = pickle.load(f)
```

> [!warning] Never unpickle files from untrusted sources
> Both `pickle` and `joblib` (which uses pickle internally) can execute arbitrary code during deserialization — only load files you trust.

---

## Version Compatibility Warning

> [!warning] Pickled models are tied to library versions
> A model saved with scikit-learn 1.3 may fail to load, or load with subtly incorrect behavior, in scikit-learn 1.5+ if internal APIs changed. Record the exact `sklearn.__version__` used to train, and prefer retraining over loading across major version gaps in production-critical settings.

```python
import sklearn
print(sklearn.__version__)     # record this alongside your saved model file
```

---

## Alternative: ONNX (Cross-Language, Version-Independent Deployment)

```python
# pip install skl2onnx onnxruntime
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

onnx_model = convert_sklearn(model, initial_types=[("input", FloatTensorType([None, n_features]))])
with open("model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
```

> [!info] When ONNX makes sense
> Converts a trained sklearn model into a portable format runnable in other languages (C++, Java, JavaScript via ONNX Runtime) without needing Python/scikit-learn installed at inference time — useful for production deployment outside a Python environment.

---

## Storing Metadata Alongside the Model

```python
import json

metadata = {
    "sklearn_version": sklearn.__version__,
    "trained_on": "2026-08-01",
    "features": list(X_train.columns),
    "metrics": {"accuracy": 0.91, "f1": 0.89}
}
with open("model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)
```

> [!tip] Always log what a saved model was trained on
> Feature names/order, training date, library versions, and evaluation metrics — this context is easy to lose otherwise and critical for debugging a model months later.

---

## Related
- [[04-Pipelines-ColumnTransformer]]
- [[03-IO-Reading-Writing|Pandas: IO Reading & Writing]]
- [[Machine Learning/Libraries/ML/sklearn/17-Common-Errors-Gotchas]]
