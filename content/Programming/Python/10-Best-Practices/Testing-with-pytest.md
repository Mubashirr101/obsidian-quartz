---
tags: [python, best-practices, testing, pytest]
aliases: [pytest, Python Testing, Unit Testing]
---

# Testing with pytest

`pytest` is the de facto standard testing framework for Python, favored over the built-in `unittest` for its simpler syntax and powerful features.

## Installation and Basic Test

```bash
pip install pytest
```

```python
# test_math_utils.py
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
```

```bash
pytest                    # discovers and runs all test_*.py / *_test.py files automatically
pytest test_math_utils.py     # run a specific file
pytest -v                       # verbose output, shows each test name
pytest -k "add"                   # run only tests matching a keyword
```

## Test Discovery Rules

pytest automatically finds:
- Files named `test_*.py` or `*_test.py`
- Functions named `test_*` inside those files
- Classes named `Test*` (without an `__init__`), with methods named `test_*`

## Assertions

pytest uses plain `assert` statements, no special assertion methods needed like in `unittest`.

```python
def test_examples():
    assert 1 + 1 == 2
    assert "hello".upper() == "HELLO"
    assert [1, 2, 3] == [1, 2, 3]
    assert isinstance(5, int)
    assert 5 in [1, 2, 5]
```

## Testing for Exceptions

```python
import pytest

def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def test_divide_by_zero_raises():
    with pytest.raises(ValueError):
        divide(10, 0)

def test_divide_by_zero_message():
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)
```

## Fixtures: Reusable Setup

```python
import pytest

@pytest.fixture
def sample_data():
    return {"name": "Bob", "age": 25}

def test_name(sample_data):        # fixture injected automatically by NAME matching
    assert sample_data["name"] == "Bob"

def test_age(sample_data):
    assert sample_data["age"] == 25
```

### Fixtures with Setup/Teardown

```python
@pytest.fixture
def db_connection():
    conn = create_connection()      # setup
    yield conn                          # test runs here
    conn.close()                            # teardown, runs after the test regardless of pass/fail

def test_query(db_connection):
    result = db_connection.query("SELECT 1")
    assert result is not None
```

### Fixture Scope

```python
@pytest.fixture(scope="function")    # default: fresh instance for EVERY test
@pytest.fixture(scope="module")        # shared across all tests in one file
@pytest.fixture(scope="session")         # shared across the ENTIRE test run
def expensive_resource():
    return create_expensive_thing()
```

## Parametrized Tests: Running One Test with Many Inputs

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
```

> [!tip] Parametrize instead of copy-pasting near-identical tests
> This produces 4 separate, individually reported test cases from one function definition, and makes it trivial to add new edge cases without duplicating test logic.

## Mocking External Dependencies

```python
from unittest.mock import patch, MagicMock

def get_weather(api_client):
    return api_client.fetch("weather")

def test_get_weather():
    mock_client = MagicMock()
    mock_client.fetch.return_value = {"temp": 25}
    result = get_weather(mock_client)
    assert result == {"temp": 25}
    mock_client.fetch.assert_called_once_with("weather")

@patch("my_module.requests.get")      # patches requests.get wherever it's used in my_module
def test_api_call(mock_get):
    mock_get.return_value.json.return_value = {"status": "ok"}
    ...
```

## Organizing Tests

```
project/
    src/
        my_package/
            calculator.py
    tests/
        test_calculator.py
    conftest.py          # shared fixtures available to ALL test files automatically
```

## Test Coverage

```bash
pip install pytest-cov
pytest --cov=my_package --cov-report=term-missing
```

> [!tip] Coverage percentage is a floor, not a target
> 100% coverage does not mean bug-free code, it only means every LINE ran at least once during tests, not that every meaningful CASE or edge condition was checked. Treat coverage reports as a tool for finding untested code paths, not a quality certificate.

## AAA Pattern: Arrange, Act, Assert

```python
def test_withdraw_reduces_balance():
    # Arrange
    account = BankAccount(balance=100)

    # Act
    account.withdraw(30)

    # Assert
    assert account.balance == 70
```

> [!tip] Keep this structure visible in every test
> Even without explicit comments, structuring tests as setup, action, then verification makes them dramatically easier to read and debug when they fail.
