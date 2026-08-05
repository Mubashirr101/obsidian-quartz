---
title: psql & Admin Commands
tags: [postgresql, sql, psql, admin, backup, roles]
aliases: [psql meta-commands, pg_dump, GRANT REVOKE]
---

# `psql` & Admin Commands

> [!abstract] Definition
> Beyond writing SQL, day-to-day Postgres work relies on **`psql`'s meta-commands** (backslash commands, run client-side, never sent to the server as SQL) and command-line tools for backup, restore, roles, and permissions.

---

## Essential `psql` Meta-Commands

```
\l                    list all databases
\c dbname             connect to a different database
\c dbname username      connect as a specific user

\dt                   list tables in the current schema
\dt *.*                 list tables across ALL schemas
\d tablename            describe a table (columns, types, indexes, constraints)
\d+ tablename             describe with extra detail (storage size, comments)

\dv                   list views
\df                     list functions
\di                       list indexes
\dn                         list schemas
\du                           list roles/users
\dp                             list table permissions (privileges)

\x                    toggle expanded display (one column per line - great for wide rows)
\timing                 toggle showing query execution time after each command
\e                        open the current query in your $EDITOR
\watch 5                    re-run the last query every 5 seconds

\i script.sql          execute a SQL script file
\o output.txt             redirect query output to a file (\o alone turns it back off)

\q                    quit psql
\?                      help - list ALL meta-commands
\h SELECT                 help for a specific SQL command's syntax
```

> [!tip] `\x auto` is a great default
> Automatically switches to expanded (vertical) display only when a row would be too wide for the terminal - readable either way without manually toggling.

---

## Roles & Permissions

```sql
CREATE ROLE analyst WITH LOGIN PASSWORD 'secret';
CREATE ROLE readonly_group;                             -- a role with no LOGIN can act as a permission "group"

GRANT readonly_group TO analyst;                          -- add analyst to the group role

GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_group;
GRANT SELECT, INSERT, UPDATE ON users TO analyst;
GRANT USAGE ON SCHEMA public TO analyst;                     -- needed to even "see" objects in a schema

REVOKE INSERT ON users FROM analyst;
REVOKE ALL PRIVILEGES ON users FROM analyst;

ALTER ROLE analyst WITH PASSWORD 'new_secret';
ALTER ROLE analyst RENAME TO senior_analyst;
DROP ROLE analyst;
```

| Privilege | Grants ability to |
|---|---|
| `SELECT` | read rows |
| `INSERT` | add rows |
| `UPDATE` | modify existing rows |
| `DELETE` | remove rows |
| `TRUNCATE` | empty the table entirely |
| `REFERENCES` | create a foreign key pointing to this table |
| `USAGE` | (on a schema) "see into" the schema at all |
| `ALL PRIVILEGES` | everything above at once |

> [!tip] Default privileges for future objects
> `GRANT SELECT ON ALL TABLES` only affects tables that already exist. To apply automatically to tables created LATER too: `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_group;`

---

## Backup & Restore

```bash
# Full database dump (custom format - recommended, supports selective restore)
pg_dump -U username -d mydb -F c -f backup.dump

# Plain SQL dump (human-readable, portable)
pg_dump -U username -d mydb -F p -f backup.sql

# Dump only the schema (no data)
pg_dump -U username -d mydb --schema-only -f schema.sql

# Dump only the data (no schema)
pg_dump -U username -d mydb --data-only -f data.sql

# Dump a single table
pg_dump -U username -d mydb -t users -f users_table.dump
```

```bash
# Restore from a custom-format dump
pg_restore -U username -d mydb backup.dump

# Restore a plain SQL dump
psql -U username -d mydb -f backup.sql

# Dump ALL databases on a server (roles, tablespaces, everything)
pg_dumpall -U username -f full_cluster_backup.sql
```

> [!tip] Custom format (`-F c`) over plain SQL (`-F p`) for real backups
> The custom format is compressed, and `pg_restore` allows selective restoration (specific tables, schema-only, parallel restore with `-j`) - plain SQL dumps must be restored in their entirety via `psql`.

---

## `VACUUM` & `ANALYZE` - Routine Maintenance

```sql
VACUUM users;                  -- reclaims space from deleted/updated rows (MVCC "dead tuples")
VACUUM FULL users;                -- more aggressive, rewrites the table, LOCKS it - use sparingly, during downtime
VACUUM ANALYZE users;                -- vacuum + refresh planner statistics (recommended combo)
ANALYZE users;                          -- just refresh statistics, no cleanup

VACUUM VERBOSE users;                     -- show detailed output on what was reclaimed
```

> [!info] Why `VACUUM` is necessary
> Postgres's MVCC (Multi-Version Concurrency Control) doesn't immediately erase old row versions on `UPDATE`/`DELETE` - it marks them as "dead" for cleanup later, so concurrent transactions can still see consistent snapshots. `VACUUM` reclaims that dead space. Postgres runs **autovacuum** automatically by default, but manual `VACUUM` is sometimes needed after huge bulk deletes.

---

## Monitoring Activity

```sql
SELECT * FROM pg_stat_activity;                            -- currently running queries/connections
SELECT pid, query, state FROM pg_stat_activity WHERE state != 'idle';

SELECT pg_terminate_backend(12345);                            -- forcibly kill a specific connection/query by PID

SELECT pg_size_pretty(pg_database_size('mydb'));                 -- human-readable database size
SELECT pg_size_pretty(pg_total_relation_size('users'));             -- table size, including indexes
```

---

## Extensions

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";     -- e.g. for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS pgcrypto;           -- e.g. for gen_random_uuid(), hashing functions
CREATE EXTENSION IF NOT EXISTS pg_trgm;              -- trigram matching, powers fuzzy/similarity text search

\dx                    -- list installed extensions
```

---

## Related
- [[01-Installation-Connection]]
- [[11-Indexes]]
- [[12-Transactions]]
- [[19-Common-Errors-Gotchas]]
