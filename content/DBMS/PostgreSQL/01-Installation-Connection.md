---
title: Installation & Connection
tags: [postgresql, sql, setup, psql]
aliases: [psql, connect to postgres, install postgresql]
---

# Installation & Connection

> [!abstract] Definition
> Before writing any SQL, Postgres needs to be installed and running as a server process, and you need a client to talk to it - almost always **`psql`**, the official command-line interface.

---

## Installing PostgreSQL

```bash
# Debian / Ubuntu
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Windows
# Download the installer from https://www.postgresql.org/download/windows/
```

Verify:

```bash
psql --version
```

---

## Starting/Stopping the Server

```bash
# Linux (systemd)
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl status postgresql

# macOS (Homebrew services)
brew services start postgresql@16
brew services stop postgresql@16
```

---

## The Default `postgres` Role & Database

On install, Postgres creates a superuser role (usually named `postgres`) and a default database also named `postgres`.

```bash
sudo -u postgres psql        # Linux: switch to the postgres OS user, then open psql
psql -U postgres                # if password auth is set up directly
```

---

## Connecting with `psql`

```bash
psql -U username -d database_name -h localhost -p 5432
```

| Flag | Meaning |
|---|---|
| `-U` | username/role |
| `-d` | database name to connect to |
| `-h` | host (`localhost`, an IP, or a hostname) |
| `-p` | port (default `5432`) |
| `-W` | force a password prompt |

```bash
psql "postgresql://username:password@localhost:5432/mydb"   # full connection URI, one string
```

> [!tip] Set `PGPASSWORD` or use a `.pgpass` file for scripts
> Hardcoding passwords in scripts is risky. A `~/.pgpass` file (format `hostname:port:database:username:password`, permissions `600`) lets `psql` authenticate silently without prompting or exposing the password in shell history.

---

## Creating Roles & Databases

```sql
CREATE ROLE myuser WITH LOGIN PASSWORD 'secret';
ALTER ROLE myuser CREATEDB;                          -- grant permission to create databases
CREATE DATABASE mydb OWNER myuser;
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

```bash
createuser myuser        # shell shortcut, equivalent to CREATE ROLE
createdb mydb               # shell shortcut, equivalent to CREATE DATABASE
dropdb mydb                    # shell shortcut for DROP DATABASE
```

> [!info] See [[18-psql-Admin-Commands]] for the full roles/permissions reference.

---

## Essential `psql` Meta-Commands (First Ones to Know)

```
\l              list all databases
\c dbname       connect to a different database
\dt             list tables in the current schema
\d tablename    describe a table's columns, types, and indexes
\du             list roles/users
\q              quit psql
```

> [!info] See [[18-psql-Admin-Commands]] for the complete meta-command reference.

---

## GUI Alternatives to `psql`

> [!info] pgAdmin, DBeaver, TablePlus
> All three are popular graphical clients for browsing schemas, running queries, and visually inspecting data - useful alongside `psql`, especially early on. This vault focuses on the SQL/`psql` command layer since it transfers to any client.

---

## Connecting from Application Code (Reference)

```python
# Python, via psycopg2 or SQLAlchemy - see Pandas: IO Reading & Writing for pd.read_sql()
import psycopg2
conn = psycopg2.connect(host="localhost", dbname="mydb", user="myuser", password="secret")
```

---

## Related
- [[03-DDL-Tables]]
- [[18-psql-Admin-Commands]]
- [[03-IO-Reading-Writing|Pandas: IO Reading & Writing]]
