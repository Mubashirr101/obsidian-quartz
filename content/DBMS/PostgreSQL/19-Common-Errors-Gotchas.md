---
title: Common Errors & Gotchas
tags: [postgresql, sql, debugging, gotchas]
aliases: [postgres errors, NULL traps, SQL gotchas]
---

# Common Errors & Gotchas

> [!abstract] Purpose
> A troubleshooting reference for the mistakes, error messages, and conceptual traps that come up most often when working with PostgreSQL.

---

## `NULL` Comparisons Never Match

```sql
SELECT * FROM users WHERE middle_name = NULL;         -- WRONG - always returns zero rows
SELECT * FROM users WHERE middle_name IS NULL;           -- CORRECT
```

> [!warning] `NULL` means "unknown," not "empty"
> Any comparison involving `NULL` (`=`, `<>`, `>`, etc.) evaluates to `NULL` (unknown), not `TRUE` or `FALSE` - and `WHERE` only keeps rows where the condition is `TRUE`. Always use `IS NULL`/`IS NOT NULL`.

---

## `NOT IN` with a `NULL`-Containing Subquery

```sql
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);
-- returns ZERO rows if even ONE row in orders.user_id is NULL!

SELECT * FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
-- CORRECT and safe regardless of NULLs
```

> See [[09-Subqueries-CTEs]] for the full explanation - always prefer `NOT EXISTS` over `NOT IN` with subqueries.

---

## `GROUP BY` Column Mismatch

```sql
SELECT city, name, COUNT(*) FROM users GROUP BY city;
-- ERROR: column "users.name" must appear in the GROUP BY clause or be used in an aggregate function
```

> Every non-aggregated column in `SELECT` must also appear in `GROUP BY` - Postgres can't guess which row's `name` to display per city group. Either add `name` to `GROUP BY`, or wrap it in an aggregate like `array_agg(name)`.

---

## Case Sensitivity of Unquoted Identifiers

```sql
CREATE TABLE Users (...);         -- Postgres silently folds this to lowercase: "users"
SELECT * FROM Users;                 -- works fine, matches "users"
SELECT * FROM "Users";                 -- ERROR - no table named exactly "Users" (capital U) exists
```

> [!warning] Unquoted identifiers are automatically lowercased
> If you ever use double-quotes to force mixed-case table/column names at creation time, you must use double-quotes with the EXACT case every time you reference them afterward. Simplest fix: stick to lowercase, `snake_case` names everywhere and never quote identifiers.

---

## Forgetting `WHERE` on `UPDATE`/`DELETE`

```sql
UPDATE users SET status = 'inactive';       -- updates EVERY row - no WHERE clause!
DELETE FROM orders;                            -- deletes EVERY row!
```

> [!danger] Always run the equivalent `SELECT` first
> Before running `UPDATE`/`DELETE`, run `SELECT * FROM table WHERE <same condition>` to confirm exactly which rows will be affected. Consider wrapping risky statements in a transaction (`BEGIN; ... ; ROLLBACK;` to test, or `COMMIT;` once confirmed) - see [[12-Transactions]].

---

## Ambiguous Column References in Joins

```sql
SELECT id, name FROM users JOIN orders ON users.id = orders.user_id;
-- ERROR: column reference "id" is ambiguous (both tables have an "id" column)

SELECT users.id, users.name FROM users JOIN orders ON users.id = orders.user_id;   -- CORRECT - qualify columns
```

> Always qualify column names with the table (or alias) when joining tables that share column names.

---

## Implicit Type Casting Surprises

```sql
SELECT '5' + 3;               -- ERROR in Postgres - unlike some databases, no automatic string-to-int coercion here
SELECT '5'::INT + 3;             -- CORRECT - explicit cast required

SELECT * FROM users WHERE id = '5';   -- often works (implicit cast in a comparison context) but explicit is safer
```

> [!tip] Postgres is stricter about implicit type conversion than MySQL/SQLite
> When in doubt, cast explicitly with `::type` rather than relying on Postgres to guess what you meant.

---

## Trailing Comma / Missing Comma in Column Lists

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,     -- trailing comma here would cause a syntax error
);
```

```sql
SELECT id, name FROM users;   -- missing comma between id and name -> syntax error, easy typo
```

---

## Column Alias Not Usable in `WHERE`

```sql
SELECT price * 1.1 AS price_with_tax FROM products WHERE price_with_tax > 100;
-- ERROR: column "price_with_tax" does not exist

SELECT price * 1.1 AS price_with_tax FROM products WHERE price * 1.1 > 100;    -- repeat the expression
-- OR, use a subquery/CTE:
SELECT * FROM (SELECT price * 1.1 AS price_with_tax FROM products) sub WHERE price_with_tax > 100;
```

> See [[06-Querying-Select-Where]] for the logical execution order explanation - `WHERE` runs before `SELECT`, so aliases defined in `SELECT` don't exist yet. (`ORDER BY`, which runs AFTER `SELECT`, CAN use the alias.)

---

## Off-By-One in Array Indexing

```sql
SELECT tags[0] FROM posts;      -- returns NULL - Postgres arrays are 1-INDEXED, not 0-indexed!
SELECT tags[1] FROM posts;        -- CORRECT - first element
```

---

## Deadlocks and Long-Running Transactions

```sql
SELECT * FROM pg_stat_activity WHERE state = 'idle in transaction';
```

> [!warning] "Idle in transaction" connections hold locks
> An application that opens a transaction (`BEGIN`) and then sits idle without committing/rolling back can block other queries indefinitely and prevent `VACUUM` from reclaiming dead rows. Always ensure transactions are closed promptly - most connection poolers/ORMs handle this, but it's worth monitoring `pg_stat_activity` if things feel stuck.

---

## Serial/Identity Sequence Out of Sync

```sql
-- After manually inserting rows with explicit IDs (e.g. from a data migration), the sequence can fall behind:
INSERT INTO users (id, name) VALUES (500, 'Manual Insert');
INSERT INTO users (name) VALUES ('Next Auto');    -- ERROR: duplicate key - sequence still thinks next id is < 500

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));   -- manually resync the sequence
```

---

## Slow `COUNT(*)` on Large Tables

```sql
SELECT COUNT(*) FROM huge_table;     -- can be slow - Postgres must count rows, no shortcut via metadata (MVCC visibility)

SELECT reltuples::BIGINT AS estimate FROM pg_class WHERE relname = 'huge_table';   -- fast, approximate count instead
```

> [!info] Why Postgres can't just "know" the row count instantly
> Because of MVCC, different transactions can see different sets of "visible" rows at the same time - there's no single authoritative count Postgres can cache and serve instantly. For a rough estimate (e.g. for pagination UI), query planner statistics (`pg_class.reltuples`) are far faster than an exact `COUNT(*)`.

---

## Related
- [[06-Querying-Select-Where]]
- [[09-Subqueries-CTEs]]
- [[11-Indexes]]
- [[12-Transactions]]
