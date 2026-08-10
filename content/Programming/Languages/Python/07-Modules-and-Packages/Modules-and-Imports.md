---
tags: [python, modules, imports]
aliases: [Python Modules, import statement]
---

# Modules and Imports

A module is simply a `.py` file. Anything defined in it (functions, classes, variables) becomes accessible to other files via `import`.

## Import Styles

```python
import math                       # import the whole module, access via math.sqrt()
math.sqrt(16)

import math as m                    # alias, useful for long/conflicting names
m.sqrt(16)

from math import sqrt                 # import a specific name directly into your namespace
sqrt(16)

from math import sqrt, pi               # import multiple specific names
from math import *                        # import everything (avoid, see below)
```

> [!warning] Avoid `from module import *`
> This pollutes your namespace with every public name from that module, making it unclear where a given name came from, and risking silent overwrites of your own variables/functions with the same name. Always import explicitly.

## How Python Finds Modules

When you `import foo`, Python searches, in order:
1. The directory of the script being run.
2. Directories listed in the `PYTHONPATH` environment variable.
3. Standard library directories.
4. Site-packages (where `pip`-installed packages live).

```python
import sys
print(sys.path)     # the actual list of directories searched, in order
```

## Module Caching: Imports Only Run Once

```python
# my_module.py
print("my_module is being loaded")
x = 42
```

```python
import my_module     # prints 'my_module is being loaded'
import my_module       # prints NOTHING, already cached in sys.modules, not re-executed
```

> [!info]
> `sys.modules` is a dict cache of every module already imported in the current process. Repeated `import` statements for the same module are essentially free after the first one.

## Reloading a Module (Rare, Mostly for Interactive Development)

```python
import importlib
import my_module
importlib.reload(my_module)     # forces re-execution, useful in REPL/notebook workflows
```

## Relative vs Absolute Imports (Within a Package)

```python
# project/
#   package/
#     __init__.py
#     module_a.py
#     module_b.py

# Inside module_b.py:
from package.module_a import some_function     # absolute import, unambiguous, PREFERRED
from . import module_a                            # relative import, . means "this package"
from .module_a import some_function                  # relative import of a specific name
from .. import sibling_package                          # .. means "one level up"
```

> [!tip] Prefer absolute imports for clarity
> Absolute imports (`from package.module_a import x`) are explicit about exactly where something comes from and behave predictably regardless of how the script is run. Relative imports (`from . import x`) only work correctly when the file is part of a properly recognized package, and can break when a file is run directly as a script.

## Circular Imports

```python
# a.py
from b import func_b

def func_a():
    return func_b()

# b.py
from a import func_a     # ImportError! a.py hasn't finished loading func_a yet

def func_b():
    return func_a()
```

> [!warning] Circular import fix strategies
> 1. Restructure code to remove the mutual dependency (often the real fix, indicates poor separation of concerns).
> 2. Move the import inside the function body instead of the top of the file, deferring it until it's actually called.
> 3. Merge the two modules if they are this tightly coupled.

## `__init__.py`: Making a Directory a Package

```
mypackage/
    __init__.py
    module_a.py
    module_b.py
```

`__init__.py` can be empty (just marks the directory as a package) or can control what gets exposed:

```python
# mypackage/__init__.py
from .module_a import function_a
from .module_b import function_b

__all__ = ["function_a", "function_b"]     # controls `from mypackage import *` behavior
```

```python
from mypackage import function_a     # works because __init__.py re-exported it
```

> [!info] Namespace packages
> Since Python 3.3, `__init__.py` is technically optional for a directory to be treated as a package (namespace packages). In practice, most real projects still include it for explicit control over what the package exposes.

## Running a Module as a Script

```bash
python -m module_name        # runs module_name as __main__, respects package imports correctly
python module_name.py           # runs the file directly, but package-relative imports can break
```

> [!tip] `python -m` is usually the safer way to run project code
> This matters especially for scripts inside a package that use relative imports internally, `python -m package.script` resolves correctly where `python package/script.py` often does not.
