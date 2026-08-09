---
tags: [python, error-handling, custom-exceptions]
aliases: [Custom Exceptions, User Defined Exceptions]
---

# Custom Exceptions

Define application-specific error types by subclassing `Exception` (or a more specific built-in).

## Basic Custom Exception

```python
class InsufficientFundsError(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(f"Cannot withdraw {amount}, balance is {balance}")
    return balance - amount

try:
    withdraw(100, 500)
except InsufficientFundsError as e:
    print(e)     # 'Cannot withdraw 500, balance is 100'
```

## Adding Custom Attributes and Behavior

```python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        self.shortfall = amount - balance
        message = f"Need {self.shortfall} more to withdraw {amount}"
        super().__init__(message)

try:
    raise InsufficientFundsError(balance=100, amount=500)
except InsufficientFundsError as e:
    print(e.shortfall)     # 400, structured data, not just a message string
```

## Building an Exception Hierarchy

Organizing related exceptions under a common base lets calling code catch broadly OR narrowly, as needed.

```python
class AppError(Exception):
    """Base exception for all application-specific errors."""
    pass

class ValidationError(AppError):
    pass

class DatabaseError(AppError):
    pass

class RecordNotFoundError(DatabaseError):
    pass

try:
    raise RecordNotFoundError("User 42 not found")
except DatabaseError as e:        # catches RecordNotFoundError too, since it's a subclass
    print(f"DB issue: {e}")
except AppError as e:
    print(f"App issue: {e}")
```

> [!tip] Design pattern: one base exception per package/app
> Define a root exception (e.g. `AppError`) for your project. Calling code that wants to catch "anything my app might throw, but not unrelated library/system errors" can catch just that base class.

## When to Create a Custom Exception vs Reuse a Built-in

> [!tip] Guideline
> Create a custom exception when the error represents a distinct, meaningful condition in YOUR domain logic that calling code might want to handle differently (e.g. `InsufficientFundsError` vs a generic `ValueError`). Reuse a built-in (`ValueError`, `TypeError`) for straightforward, generic argument problems that don't need special handling.

## Custom Exceptions with Multiple Constructor Arguments

```python
class APIError(Exception):
    def __init__(self, status_code, message):
        self.status_code = status_code
        super().__init__(f"[{status_code}] {message}")

try:
    raise APIError(404, "User not found")
except APIError as e:
    print(e.status_code)     # 404
    print(str(e))               # '[404] User not found'
```
