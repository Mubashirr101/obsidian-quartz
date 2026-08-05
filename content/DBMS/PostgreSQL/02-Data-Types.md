---
title: Data Types
tags: [postgresql, sql, data-types]
aliases: [postgres data types, column types]
---

# Data Types

> [!abstract] Definition
> Every column in a Postgres table has a declared data type, which determines what values it can hold, how much storage it uses, and which operators/functions apply to it. Postgres has an unusually rich type system compared to most databases, including arrays, JSON, ranges, and user-defined types.

---

## Numeric Types

| Type | Storage | Range / Notes |
|---|---|---|
| `SMALLINT` | 2 bytes | -32,768 to 32,767 |
| `INTEGER` / `INT` | 4 bytes | -2.1 billion to 2.1 billion |
| `BIGINT` | 8 bytes | huge range, use for IDs at scale |
| `DECIMAL(p,s)` / `NUMERIC(p,s)` | variable | exact precision, use for money |
| `REAL` | 4 bytes | 6 decimal digits precision, floating point |
| `DOUBLE PRECISION` | 8 bytes | 15 decimal digits precision, floating point |
| `SERIAL` | 4 bytes | auto-incrementing integer (creates a sequence) |
| `BIGSERIAL` | 8 bytes | auto-incrementing bigint |

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2)      -- up to 10 total digits, 2 after the decimal - exact, no floating-point error
);
```

> [!warning] Never use `REAL`/`DOUBLE PRECISION` for money
> Floating-point types can't represent decimal fractions exactly (`0.1 + 0.2 != 0.3`). Always use `NUMERIC`/`DECIMAL` for currency or any value requiring exact arithmetic.

> [!info] `SERIAL` is legacy syntax
> Since Postgres 10, `GENERATED ALWAYS AS IDENTITY` is the SQL-standard, recommended replacement - see [[03-DDL-Tables]].

---

## Character Types

| Type | Notes |
|---|---|
| `VARCHAR(n)` | variable-length, max `n` characters |
| `CHAR(n)` | fixed-length, space-padded to `n` characters |
| `TEXT` | variable-length, unlimited |

```sql
name VARCHAR(100)
code CHAR(3)          -- e.g. country codes: 'IND', 'USA'
description TEXT
```

> [!tip] Just use `TEXT` unless there's a real reason not to
> In Postgres, `VARCHAR(n)` and `TEXT` have identical performance internally - `VARCHAR` only adds a length check. Many teams default to `TEXT` everywhere and enforce length limits with a `CHECK` constraint if truly needed.

---

## Boolean

```sql
is_active BOOLEAN DEFAULT true
```

Accepted literal values: `TRUE`, `FALSE`, `'yes'`, `'no'`, `'1'`, `'0'`, `'t'`, `'f'` (all case-insensitive).

---

## Date & Time Types

| Type | Notes |
|---|---|
| `DATE` | date only, no time |
| `TIME` | time only, no date |
| `TIMESTAMP` | date + time, no timezone |
| `TIMESTAMPTZ` | date + time, WITH timezone (stored as UTC internally) |
| `INTERVAL` | a duration/span of time |

```sql
created_at TIMESTAMPTZ DEFAULT now()
event_date DATE
duration INTERVAL

SELECT now();                             -- current timestamp with timezone
SELECT now() - INTERVAL '7 days';           -- date arithmetic
SELECT age(timestamp '2026-01-01');           -- interval between now and a date
```

> [!warning] Prefer `TIMESTAMPTZ` over `TIMESTAMP` almost always
> `TIMESTAMPTZ` stores an unambiguous point in time (converted to/from UTC based on the session's timezone setting). Plain `TIMESTAMP` stores a "wall clock" value with no timezone context, which causes bugs the moment users or servers span timezones.

---

## Arrays

```sql
tags TEXT[]
scores INTEGER[]

INSERT INTO posts (tags) VALUES (ARRAY['sql', 'postgres', 'tutorial']);
INSERT INTO posts (tags) VALUES ('{sql,postgres,tutorial}');   -- alternate literal syntax

SELECT * FROM posts WHERE 'sql' = ANY(tags);         -- membership test
SELECT tags[1] FROM posts;                             -- 1-indexed! not 0-indexed
SELECT array_length(tags, 1) FROM posts;
```

---

## JSON & JSONB

```sql
metadata JSON        -- stores exact text, re-parsed every time it's read
metadata JSONB          -- stores a decomposed BINARY format, supports indexing, generally preferred
```

> [!info] See [[16-JSON-JSONB]] for the full reference on querying, indexing, and manipulating JSON/JSONB columns.

---

## UUID

```sql
id UUID DEFAULT gen_random_uuid() PRIMARY KEY   -- requires the pgcrypto extension (built-in since PG 13)
```

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- enable if gen_random_uuid() isn't available
```

> [!tip] UUID vs SERIAL for primary keys
> UUIDs avoid ID collisions across distributed systems/merges and don't reveal row counts, but are larger (16 bytes vs 4-8) and less index-friendly than sequential integers. Many teams use `BIGSERIAL`/`IDENTITY` internally plus a separate `UUID` "public ID" for APIs.

---

## Enumerated Types

```sql
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status order_status DEFAULT 'pending'
);
```

> [!tip] `ENUM` vs a `CHECK` constraint vs a lookup table
> `ENUM` is fast and self-documenting for a truly fixed, rarely-changing set of values. A `CHECK (status IN (...))` constraint is easier to modify. A separate lookup table with a foreign key is best when the list of values needs its own metadata or changes often.

---

## Range Types

```sql
CREATE TABLE bookings (
    room_id INT,
    during TSRANGE      -- a range of timestamps
);

INSERT INTO bookings VALUES (1, '[2026-08-01 14:00, 2026-08-01 16:00)');

SELECT * FROM bookings WHERE during && '[2026-08-01 15:00, 2026-08-01 17:00)';  -- overlap check with &&
```

Common range types: `INT4RANGE`, `INT8RANGE`, `NUMRANGE`, `TSRANGE`, `TSTZRANGE`, `DATERANGE`.

---

## Casting Between Types

```sql
SELECT '123'::INTEGER;               -- Postgres shorthand cast syntax
SELECT CAST('123' AS INTEGER);         -- SQL-standard equivalent
SELECT age::TEXT FROM users;
SELECT '2026-08-04'::DATE;
```

---

## Related
- [[03-DDL-Tables]]
- [[16-JSON-JSONB]]
- [[19-Common-Errors-Gotchas]]
