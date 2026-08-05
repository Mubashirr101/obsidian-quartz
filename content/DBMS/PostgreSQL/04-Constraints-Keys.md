---
title: Constraints & Keys
tags: [postgresql, sql, constraints, foreign-key, primary-key]
aliases: [PRIMARY KEY, FOREIGN KEY, CHECK constraint]
---

# Constraints & Keys

> [!abstract] Definition
> Constraints enforce data integrity rules directly at the database level - guaranteeing uniqueness, required fields, valid ranges, and valid relationships between tables - so invalid data can never be inserted, regardless of which application writes to the database.

---

## Primary Key

```sql
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT
);

-- Composite primary key (multiple columns together must be unique)
CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    PRIMARY KEY (order_id, product_id)
);
```

> [!info] What a primary key guarantees
> Uniqueness AND non-null, automatically. Postgres also creates a unique B-tree index on the primary key columns automatically - see [[11-Indexes]].

---

## Foreign Key

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    amount NUMERIC
);

-- Explicit, named version (recommended for clarity in larger schemas)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### `ON DELETE` / `ON UPDATE` Actions

```sql
user_id BIGINT REFERENCES users(id) ON DELETE CASCADE     -- deleting a user deletes their orders too
user_id BIGINT REFERENCES users(id) ON DELETE SET NULL      -- deleting a user nulls out this column instead
user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT         -- (default) blocks deletion of a referenced user
```

| Action | Behavior when the referenced row is deleted |
|---|---|
| `RESTRICT` (default) | blocks the delete entirely if references exist |
| `CASCADE` | deletes/updates dependent rows automatically |
| `SET NULL` | sets the foreign key column to `NULL` |
| `SET DEFAULT` | sets the foreign key column to its default value |
| `NO ACTION` | similar to `RESTRICT`, but check is deferred until end of transaction |

> [!warning] `ON DELETE CASCADE` is powerful and dangerous
> A careless cascade chain can silently delete far more data than intended. Use it deliberately (e.g. deleting a user's own private data), and double-check cascade chains in schemas with many interlinked foreign keys.

---

## Unique Constraint

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE
);

-- Composite uniqueness: no two rows can share BOTH values together
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    UNIQUE (student_id, course_id)
);
```

> [!info] `UNIQUE` allows multiple `NULL`s
> Unlike non-null values, `NULL` is never considered equal to another `NULL` under standard SQL semantics - so a `UNIQUE` column can contain many `NULL` rows simultaneously without violation.

---

## `NOT NULL`

```sql
name TEXT NOT NULL
```

Ensures a column can never be left empty. Combine with `DEFAULT` for a safe fallback:

```sql
status TEXT NOT NULL DEFAULT 'pending'
```

---

## `CHECK` Constraint

```sql
age INT CHECK (age >= 0)
price NUMERIC CHECK (price > 0)

-- Named, and referencing multiple columns
CONSTRAINT valid_dates CHECK (end_date > start_date)
```

```sql
ALTER TABLE products ADD CONSTRAINT positive_price CHECK (price > 0);
```

> [!tip] Use `CHECK` for business rules that are always true
> Anything that should never be violated regardless of which application code touches the table belongs at the database level, not just in application validation - it's the last line of defense against bad data.

---

## `DEFAULT`

```sql
created_at TIMESTAMPTZ DEFAULT now()
is_active BOOLEAN DEFAULT true
status TEXT DEFAULT 'pending'
id UUID DEFAULT gen_random_uuid()
```

---

## `EXCLUDE` Constraint (Advanced - Prevent Overlaps)

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
    room_id INT,
    during TSRANGE,
    EXCLUDE USING gist (room_id WITH =, during WITH &&)   -- no two bookings for the same room can overlap in time
);
```

> [!info] What `EXCLUDE` solves
> A `UNIQUE` constraint only prevents identical values; `EXCLUDE` generalizes this to prevent any pair of rows from satisfying a given condition (like time-range overlap) - useful for scheduling/booking systems.

---

## Deferrable Constraints (Advanced)

```sql
CONSTRAINT fk_x FOREIGN KEY (x) REFERENCES y(id) DEFERRABLE INITIALLY DEFERRED
```

> [!info] What deferring does
> Normally, constraints are checked immediately after each statement. `DEFERRABLE INITIALLY DEFERRED` postpones the check until `COMMIT` - useful when inserting rows with circular or mutual foreign-key dependencies within a single transaction.

---

## Viewing Constraints on a Table

```sql
\d tablename          -- psql meta-command, lists all constraints

SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'users'::regclass;
```

---

## Related
- [[03-DDL-Tables]]
- [[07-Joins]]
- [[11-Indexes]]
- [[19-Common-Errors-Gotchas]]
