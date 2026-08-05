---
title: Aggregation & GROUP BY
tags: [postgresql, sql, aggregation, group-by, having]
aliases: [GROUP BY, HAVING, COUNT, SUM, AVG]
---

# Aggregation & `GROUP BY`

> [!abstract] Definition
> Aggregate functions collapse many rows into a single summary value (count, sum, average, etc). `GROUP BY` applies that collapsing separately **per group** instead of across the whole table, and `HAVING` filters those groups after aggregation.

---

## Aggregate Functions

```sql
SELECT COUNT(*) FROM users;                    -- total row count
SELECT COUNT(email) FROM users;                   -- count of NON-NULL emails
SELECT COUNT(DISTINCT city) FROM users;              -- count of unique cities

SELECT SUM(amount) FROM orders;
SELECT AVG(age) FROM users;
SELECT MIN(price), MAX(price) FROM products;

SELECT ARRAY_AGG(name) FROM users;                     -- collapse rows into an array
SELECT STRING_AGG(name, ', ') FROM users;                -- collapse rows into a delimited string
SELECT STRING_AGG(name, ', ' ORDER BY name) FROM users;    -- control the order within the aggregation
```

> [!warning] `COUNT(*)` vs `COUNT(column)`
> `COUNT(*)` counts every row regardless of `NULL`s. `COUNT(column)` only counts rows where that specific column is non-null - a frequent source of subtly wrong "total" numbers.

---

## `GROUP BY`

```sql
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city;

SELECT city, gender, AVG(age) AS avg_age
FROM users
GROUP BY city, gender;              -- multi-column grouping
```

> [!warning] Every non-aggregated column in `SELECT` must appear in `GROUP BY`
> `SELECT city, name, COUNT(*) FROM users GROUP BY city` raises an error - `name` isn't aggregated and isn't grouped by, so Postgres doesn't know which row's `name` to show per city group.

---

## `HAVING` - Filtering Groups (After Aggregation)

```sql
SELECT city, COUNT(*) AS user_count
FROM users
GROUP BY city
HAVING COUNT(*) > 100;
```

```mermaid
graph LR
    A[WHERE: filters rows BEFORE grouping] --> B[GROUP BY: collapses rows into groups]
    B --> C[HAVING: filters groups AFTER aggregation]
```

> [!tip] `WHERE` vs `HAVING`, in one line
> `WHERE` filters individual rows before they're grouped; `HAVING` filters the resulting groups themselves, and can reference aggregate functions like `COUNT(*)` which `WHERE` cannot.

```sql
-- Combining both: filter rows first, THEN filter the resulting groups
SELECT city, COUNT(*) AS active_users
FROM users
WHERE is_active = true
GROUP BY city
HAVING COUNT(*) > 50;
```

---

## Combining Aggregation with `JOIN`

```sql
SELECT u.name, COUNT(o.id) AS order_count, COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
```

> [!tip] `LEFT JOIN` + `GROUP BY` includes zero-count groups
> Using `LEFT JOIN` (instead of `INNER JOIN`) here ensures users with **zero** orders still appear in the result, with `order_count = 0` and `total_spent = 0`, rather than being silently dropped.

---

## `FILTER` - Conditional Aggregation (Postgres-Specific, Cleaner Than `CASE`)

```sql
SELECT
    city,
    COUNT(*) AS total_users,
    COUNT(*) FILTER (WHERE is_active = true) AS active_users,
    COUNT(*) FILTER (WHERE is_active = false) AS inactive_users
FROM users
GROUP BY city;
```

> [!tip] `FILTER` vs the older `CASE WHEN ... THEN 1 ELSE 0 END` pattern
> `COUNT(*) FILTER (WHERE condition)` is clearer and specific to Postgres's aggregate syntax - functionally equivalent to `SUM(CASE WHEN condition THEN 1 ELSE 0 END)` but far more readable.

---

## `GROUPING SETS`, `ROLLUP`, `CUBE` (Multi-Level Summaries in One Query)

```sql
-- Subtotals by city, by gender, AND a grand total - all in a single result set
SELECT city, gender, COUNT(*)
FROM users
GROUP BY GROUPING SETS ((city), (gender), ())
;

SELECT city, gender, COUNT(*)
FROM users
GROUP BY ROLLUP (city, gender);      -- hierarchical subtotals: city+gender, city alone, then grand total

SELECT city, gender, COUNT(*)
FROM users
GROUP BY CUBE (city, gender);          -- every possible combination of subtotals
```

> [!info] When these matter
> Reporting/dashboard queries that need subtotals and a grand total together (like a pivot table's "Total" row/column) - `ROLLUP`/`CUBE` avoid running several separate queries and `UNION`-ing them manually.

---

## Statistical Aggregates

```sql
SELECT
    STDDEV(price) AS std_dev,
    VARIANCE(price) AS variance,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) AS median,
    MODE() WITHIN GROUP (ORDER BY price) AS most_common_price
FROM products;
```

---

## Related
- [[06-Querying-Select-Where]]
- [[07-Joins]]
- [[10-Window-Functions]] (aggregation WITHOUT collapsing rows)
