---
tags: [python, advanced, typing, type-hints]
aliases: [Type Hints, typing module, mypy]
---

# Type Hints and Typing

Type hints are optional annotations that document expected types. They are NOT enforced at runtime by the interpreter itself, but are checked by static analysis tools like `mypy` or `pyright`, and improve editor autocomplete significantly.

## Basic Syntax

```python
def add(a: int, b: int) -> int:
    return a + b

name: str = "Bob"
age: int = 25
is_active: bool = True
```

> [!warning] Type hints are not enforced at runtime
> ```python
> def add(a: int, b: int) -> int:
>     return a + b
>
> add("hello", "world")     # runs FINE at runtime, returns 'helloworld', no error!
> ```
> To catch this, you need to actually run a type checker: `mypy your_file.py`.

## Built-in Generic Types (Python 3.9+ syntax)

```python
def process(items: list[int]) -> dict[str, int]:
    ...

def get_config() -> dict[str, str | int]:      # union type using |
    ...

coordinates: tuple[float, float] = (12.9, 77.6)
names: set[str] = {"a", "b"}
```

## `typing` Module (Needed for Python < 3.9, or More Advanced Constructs)

```python
from typing import List, Dict, Tuple, Set, Optional, Union, Any, Callable

def process(items: List[int]) -> Dict[str, int]:      # older style, pre-3.9
    ...

def find_user(user_id: int) -> Optional[str]:            # Optional[X] means X or None
    ...                                                       # equivalent to Union[X, None] or X | None

def combine(a: Union[int, str]) -> str:                   # accepts either type
    ...

def apply(func: Callable[[int, int], int], a: int, b: int) -> int:   # function type
    return func(a, b)

value: Any = "could be literally anything"     # opts OUT of type checking for this variable
```

> [!tip] `Optional[X]` vs `X | None`
> `Optional[str]` and `str | None` mean exactly the same thing. The `|` syntax (Python 3.10+) is the modern preferred style; `Optional` from `typing` is needed for older Python versions or when the codebase hasn't migrated yet.

## `TypedDict`: Typed Dictionary Shapes

```python
from typing import TypedDict

class UserDict(TypedDict):
    name: str
    age: int
    active: bool

def create_user(data: UserDict) -> None:
    print(data["name"])

create_user({"name": "Bob", "age": 25, "active": True})     # type-checker validates the shape
```

## `NamedTuple` with Type Hints

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float

p = Point(1.0, 2.0)
p.x     # 1.0
```

## Generics with `TypeVar`

Lets a function or class work with any type while preserving the relationship between input and output types.

```python
from typing import TypeVar, List

T = TypeVar("T")

def first(items: List[T]) -> T:
    return items[0]

first([1, 2, 3])          # type checker infers return type as int
first(["a", "b"])            # type checker infers return type as str
```

## `Final`: Declaring True Constants

```python
from typing import Final

MAX_RETRIES: Final = 5
MAX_RETRIES = 10     # mypy flags this as an error: cannot reassign a Final variable
```

## Type Aliases

```python
from typing import Dict, List

UserId = int
UserDatabase = Dict[UserId, str]

def lookup(db: UserDatabase, uid: UserId) -> str:
    return db[uid]

# Python 3.12+ has a dedicated syntax:
type UserDatabase = dict[int, str]
```

## Checking Types at Runtime (When You Actually Need To)

Type hints themselves don't enforce anything, but `isinstance()` still works normally alongside them for genuine runtime checks:

```python
def process(value: int | str) -> str:
    if isinstance(value, int):
        return str(value * 2)
    return value.upper()
```

## Running a Type Checker

```bash
pip install mypy
mypy my_script.py
```

> [!tip] When type hints earn their keep
> Small scripts rarely need them. Larger codebases, especially ones with multiple contributors or long-lived APIs, benefit enormously: hints double as documentation, catch entire classes of bugs before runtime, and make refactoring far safer.
