---
tags: [python, packages, project-structure]
aliases: [Python Package Structure, pyproject.toml, setup.py]
---

# Packages and Project Structure

## A Typical Project Layout

```
my_project/
    pyproject.toml          # modern build/dependency configuration (replaces setup.py)
    README.md
    LICENSE
    .gitignore
    src/
        my_package/
            __init__.py
            core.py
            utils.py
            cli.py
    tests/
        test_core.py
        test_utils.py
    docs/
```

> [!tip] The `src/` layout
> Putting your package inside `src/my_package/` rather than directly in the project root prevents accidentally importing the local uninstalled source when running tests, forcing you to test against the actually INSTALLED package, which catches packaging bugs early.

## `pyproject.toml` (Modern Standard, PEP 621)

```toml
[project]
name = "my_package"
version = "0.1.0"
description = "A short description"
dependencies = [
    "requests>=2.31",
    "pandas>=2.0",
]

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"
```

Editable/development install (changes to source reflect immediately without reinstalling):

```bash
pip install -e .
```

## `requirements.txt` (Simpler, Still Very Common)

```
requests==2.31.0
pandas==2.1.0
numpy>=1.24,<2.0
```

```bash
pip install -r requirements.txt
pip freeze > requirements.txt     # snapshot current environment's exact versions
```

## Publishing a Package to PyPI (High Level)

```bash
python -m build             # produces dist/*.whl and dist/*.tar.gz
python -m twine upload dist/*    # uploads to PyPI (requires an account/token)
```

## `__all__`: Controlling Wildcard Imports

```python
# my_module.py
__all__ = ["public_function"]     # only this name is exposed via `from my_module import *`

def public_function():
    pass

def _private_helper():             # leading underscore signals internal-only, by convention
    pass
```

## Console Scripts / Entry Points (Making a CLI Command)

```toml
[project.scripts]
my-tool = "my_package.cli:main"
```

After installing, running `my-tool` in the terminal calls `main()` inside `my_package/cli.py`.

## Distinguishing Module, Package, Library, and Framework

| Term | Meaning |
|---|---|
| Module | A single `.py` file |
| Package | A directory of modules with `__init__.py` |
| Distribution / Library | A published, installable unit (what `pip install X` gets) that may contain one or more packages |
| Framework | A library that dictates the overall structure of your application (e.g. Django), rather than being called piecemeal |

See the standalone note on Python virtual environments for isolating dependencies per project, a prerequisite for any real package work.
