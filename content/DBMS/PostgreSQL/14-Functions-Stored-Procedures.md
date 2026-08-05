---
title: Functions & Stored Procedures
tags: [postgresql, sql, plpgsql, functions, stored-procedures]
aliases: [CREATE FUNCTION, PL/pgSQL, CREATE PROCEDURE]
---

# Functions & Stored Procedures

> [!abstract] Definition
> Postgres lets you write reusable server-side logic in SQL or **PL/pgSQL** (Postgres's procedural extension of SQL, supporting variables, loops, and conditionals). **Functions** return a value and can be used inside queries; **procedures** perform actions (including their own transaction control) and are invoked with `CALL`.

---

## Simple SQL Function

```sql
CREATE FUNCTION add_numbers(a INT, b INT)
RETURNS INT AS $$
    SELECT a + b;
$$ LANGUAGE sql;

SELECT add_numbers(3, 4);   -- 7
```

> [!info] The `$$ ... $$` syntax
> These are **dollar-quoted strings** - a Postgres way of writing a string literal (here, the function body) without worrying about escaping internal single quotes. You'll see this in nearly every function/procedure definition.

---

## PL/pgSQL Function (Procedural Logic)

```sql
CREATE OR REPLACE FUNCTION get_user_status(user_age INT)
RETURNS TEXT AS $$
BEGIN
    IF user_age < 18 THEN
        RETURN 'minor';
    ELSIF user_age < 65 THEN
        RETURN 'adult';
    ELSE
        RETURN 'senior';
    END IF;
END;
$$ LANGUAGE plpgsql;

SELECT get_user_status(25);   -- 'adult'
SELECT name, get_user_status(age) FROM users;   -- usable directly in a query, just like a built-in function
```

---

## Variables & Control Flow

```sql
CREATE OR REPLACE FUNCTION calculate_discount(price NUMERIC, is_member BOOLEAN)
RETURNS NUMERIC AS $$
DECLARE
    discount_rate NUMERIC := 0.05;    -- := is the PL/pgSQL assignment operator
BEGIN
    IF is_member THEN
        discount_rate := 0.15;
    END IF;

    RETURN price * (1 - discount_rate);
END;
$$ LANGUAGE plpgsql;
```

### Loops

```sql
CREATE OR REPLACE FUNCTION sum_to_n(n INT)
RETURNS INT AS $$
DECLARE
    total INT := 0;
    i INT;
BEGIN
    FOR i IN 1..n LOOP
        total := total + i;
    END LOOP;
    RETURN total;
END;
$$ LANGUAGE plpgsql;
```

```sql
WHILE condition LOOP
    ...
END LOOP;

LOOP
    EXIT WHEN condition;
    ...
END LOOP;
```

---

## Functions Returning Multiple Rows (`RETURNS TABLE` / `SETOF`)

```sql
CREATE OR REPLACE FUNCTION get_users_by_city(target_city TEXT)
RETURNS TABLE (id INT, name TEXT, email TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.name, u.email FROM users u WHERE u.city = target_city;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_users_by_city('Mumbai');    -- called just like querying a table
```

---

## Exception Handling

```sql
CREATE OR REPLACE FUNCTION safe_divide(a NUMERIC, b NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    RETURN a / b;
EXCEPTION
    WHEN division_by_zero THEN
        RAISE NOTICE 'Division by zero avoided, returning NULL';
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

```sql
RAISE NOTICE 'informational message: %', some_variable;
RAISE WARNING 'something worth flagging';
RAISE EXCEPTION 'something went wrong: %', error_detail;   -- aborts execution, rolls back
```

---

## Procedures (`CALL`, Not `SELECT`)

```sql
CREATE OR REPLACE PROCEDURE transfer_funds(from_id INT, to_id INT, amount NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE accounts SET balance = balance - amount WHERE id = from_id;
    UPDATE accounts SET balance = balance + amount WHERE id = to_id;
    COMMIT;    -- procedures CAN manage their own transactions - functions cannot
END;
$$;

CALL transfer_funds(1, 2, 100);
```

> [!info] Function vs Procedure
> Functions are invoked inside a `SELECT`/expression and always return a value; they run within the caller's existing transaction and cannot `COMMIT`/`ROLLBACK` themselves. Procedures are invoked with `CALL`, don't have to return anything, and CAN control their own transactions internally - useful for multi-step batch jobs.

---

## Function Volatility (Performance Hint to the Planner)

```sql
CREATE FUNCTION ... LANGUAGE plpgsql IMMUTABLE AS $$ ... $$;    -- always returns the same result for the same input
CREATE FUNCTION ... LANGUAGE plpgsql STABLE AS $$ ... $$;         -- same result within a single query/transaction
CREATE FUNCTION ... LANGUAGE plpgsql VOLATILE AS $$ ... $$;         -- (default) may return different results any time
```

> [!tip] Mark functions `IMMUTABLE`/`STABLE` when true
> This lets the query planner cache results or use the function in expression indexes - `VOLATILE` (the default) disables those optimizations because Postgres must assume the result could change on every call.

---

## Dropping Functions

```sql
DROP FUNCTION add_numbers(INT, INT);     -- must specify the argument types, since functions can be overloaded
DROP FUNCTION IF EXISTS add_numbers(INT, INT);
```

---

## Related
- [[15-Triggers]]
- [[12-Transactions]]
- [[19-Common-Errors-Gotchas]]
