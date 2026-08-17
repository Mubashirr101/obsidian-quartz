---
title: JSON & JSONB
tags: [postgresql, sql, json, jsonb]
aliases: [JSONB, JSON operators, jsonb_set]
---

# JSON & JSONB

> [!abstract] Definition
> Postgres can store semi-structured data directly in a column using the **`JSON`** (stores exact text) or **`JSONB`** (stores a parsed, indexable binary format) types, and offers a rich set of operators/functions to query and manipulate that data with regular SQL.

---

## `JSON` vs `JSONB`

| | `JSON` | `JSONB` |
|---|---|---|
| Storage | exact text, re-parsed on every read | decomposed binary format |
| Whitespace/key order | preserved exactly | NOT preserved (normalized) |
| Duplicate keys | preserved (last one wins on lookup) | only the last one is kept at all |
| Indexing | not directly indexable | supports GIN indexes |
| Query performance | slower (must parse every read) | faster |

> [!tip] Use `JSONB` unless you have a specific reason not to
> Nearly every real use case (querying, indexing, filtering by keys) wants `JSONB`. `JSON` is mainly useful when you need to preserve the exact original text/formatting/key order verbatim.

---

## Inserting JSON Data

```sql
CREATE TABLE events (id SERIAL PRIMARY KEY, payload JSONB);

INSERT INTO events (payload) VALUES ('{"type": "click", "user_id": 42, "tags": ["ui", "button"]}');
```

---

## Querying JSON - Operators

```sql
SELECT payload -> 'type' FROM events;             -- returns JSON: "click" (still JSON type, with quotes)
SELECT payload ->> 'type' FROM events;               -- returns TEXT: click (unquoted, native SQL string)

SELECT payload -> 'tags' -> 0 FROM events;             -- chained: first element of the "tags" array (JSON)
SELECT payload ->> 'tags' -> 0 FROM events;              -- WRONG - ->> returns text, can't chain -> after it
SELECT payload #> '{tags,0}' FROM events;                  -- path-based access, returns JSON
SELECT payload #>> '{tags,0}' FROM events;                   -- path-based access, returns TEXT
```

| Operator | Input | Output | Meaning |
|---|---|---|---|
| `->` | key or index | `json`/`jsonb` | get a field/element, keeping JSON type |
| `->>` | key or index | `text` | get a field/element, as plain text |
| `#>` | path array `'{a,b}'` | `json`/`jsonb` | get a nested value by path, keeping JSON type |
| `#>>` | path array `'{a,b}'` | `text` | get a nested value by path, as plain text |

> [!warning] `->` chains, `->>` terminates the chain
> Once you've extracted a value as `text` with `->>`, you can no longer use `->`/`->>` again on it - it's no longer JSON. Only use `->>` for the FINAL step of a chain.

---

## Filtering with JSON Values

```sql
SELECT * FROM events WHERE payload ->> 'type' = 'click';
SELECT * FROM events WHERE (payload ->> 'user_id')::INT = 42;    -- cast text back to a real type for comparison
```

---

## Containment & Existence Operators

```sql
SELECT * FROM events WHERE payload @> '{"type": "click"}';    -- does payload CONTAIN this JSON structure?
SELECT * FROM events WHERE payload ? 'user_id';                  -- does the top-level key "user_id" EXIST?
SELECT * FROM events WHERE payload ?| ARRAY['user_id', 'session_id'];  -- has ANY of these keys
SELECT * FROM events WHERE payload ?& ARRAY['user_id', 'session_id'];    -- has ALL of these keys
```

> [!tip] `@>` is the workhorse for JSONB filtering
> The containment operator (`@>`) is what a GIN index accelerates - see the indexing section below.

---

## Modifying JSONB Data

```sql
UPDATE events SET payload = payload || '{"processed": true}'::JSONB WHERE id = 1;   -- merge/overwrite keys

UPDATE events SET payload = jsonb_set(payload, '{user_id}', '99') WHERE id = 1;       -- set a nested key by path
UPDATE events SET payload = jsonb_set(payload, '{new_key}', '"value"', true) WHERE id = 1;  -- true = create if missing

UPDATE events SET payload = payload - 'processed' WHERE id = 1;          -- remove a top-level key
UPDATE events SET payload = payload #- '{tags,0}' WHERE id = 1;            -- remove a nested path
```

---

## Building JSON From SQL Data

```sql
SELECT jsonb_build_object('id', id, 'name', name) FROM users;
SELECT row_to_json(u) FROM users u;
SELECT jsonb_agg(jsonb_build_object('id', id, 'name', name)) FROM users;   -- aggregate rows into a JSON array
```

```sql
-- Build a nested JSON result directly from a join (common API-response pattern)
SELECT jsonb_build_object(
    'user', u.name,
    'orders', jsonb_agg(jsonb_build_object('id', o.id, 'amount', o.amount))
)
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.name;
```

---

## Expanding JSON into Rows

```sql
SELECT jsonb_array_elements(payload -> 'tags') FROM events;     -- one row per array element
SELECT jsonb_each(payload) FROM events;                             -- one row per key-value pair
SELECT jsonb_object_keys(payload) FROM events;                        -- just the top-level keys
```

---

## Indexing JSONB

```sql
CREATE INDEX idx_events_payload ON events USING gin (payload);           -- speeds up @>, ?, ?|, ?& operators

CREATE INDEX idx_events_type ON events ((payload ->> 'type'));              -- expression index for a specific frequently-queried key
```

> [!info] See [[11-Indexes]] for the general GIN index reference.

---

## Related
- [[02-Data-Types]]
- [[11-Indexes]]
- [[DBMS/PostgreSql/19-Common-Errors-Gotchas]]
