---
title: Full-Text Search
tags: [postgresql, sql, full-text-search, tsvector, tsquery]
aliases: [tsvector, tsquery, to_tsvector, ts_rank]
---

# Full-Text Search

> [!abstract] Definition
> Postgres has built-in full-text search - no external service required for many use cases. It works by converting text into **`tsvector`** (a normalized, searchable list of word "lexemes"), and matching against a **`tsquery`** (a parsed search expression), with support for ranking and highlighting results.

---

## The Core Idea

```mermaid
graph LR
    A["Raw text:
'The quick brown foxes jump'"] -->|to_tsvector| B["tsvector:
'brown':3 'fox':4 'jump':5 'quick':2"]
    C["Search phrase:
'jumping foxes'"] -->|to_tsquery| D["tsquery:
'jump' & 'fox'"]
    B -->|@@ match| D
```

> [!info] Why not just `LIKE '%foxes%'`?
> Full-text search normalizes words to their root form (**stemming**: "foxes" -> "fox", "jumping" -> "jump"), ignores common "stop words" (the, a, is), ranks results by relevance, and can use a GIN index for genuine full-text speed at scale - `LIKE`/`ILIKE` does none of this and can't use a standard index for substring matches at all.

---

## `to_tsvector` and `to_tsquery`

```sql
SELECT to_tsvector('english', 'The quick brown foxes are jumping');
-- 'brown':3 'fox':4 'jump':6 'quick':2

SELECT to_tsquery('english', 'jumping & foxes');
-- 'jump' & 'fox'

SELECT to_tsvector('english', 'The quick brown foxes are jumping')
       @@ to_tsquery('english', 'jump & fox');   -- TRUE - match!
```

`@@` is the match operator: "does this tsvector satisfy this tsquery?"

---

## Searching a Table

```sql
CREATE TABLE articles (id SERIAL PRIMARY KEY, title TEXT, body TEXT);

SELECT * FROM articles
WHERE to_tsvector('english', title || ' ' || body) @@ to_tsquery('english', 'postgres & performance');
```

> [!warning] Computing `to_tsvector` on every row, every query, is slow
> The example above recalculates the tsvector for every row on every search. For real usage, store a precomputed `tsvector` column instead (see below).

---

## Precomputed `tsvector` Column (Recommended for Performance)

```sql
ALTER TABLE articles ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;

CREATE INDEX idx_articles_search ON articles USING gin (search_vector);

SELECT * FROM articles WHERE search_vector @@ to_tsquery('english', 'postgres & performance');
```

> [!tip] Generated columns keep the tsvector automatically in sync
> Since Postgres 12, a `GENERATED ALWAYS AS (...) STORED` column recomputes itself automatically whenever `title`/`body` change - no trigger needed (though triggers are the standard approach on older Postgres versions).

---

## `plainto_tsquery` and `websearch_to_tsquery` (User-Friendly Query Parsing)

```sql
SELECT plainto_tsquery('english', 'jumping foxes');        -- 'jump' & 'fox' (treats input as plain words, ANDed)
SELECT websearch_to_tsquery('english', 'foxes -lazy "brown quick"');  -- supports Google-style syntax: quotes, minus, OR
```

| Function | Best for |
|---|---|
| `to_tsquery` | full control - requires manually written boolean syntax (`&`, `|`, `!`) |
| `plainto_tsquery` | simple search boxes - takes plain text, ANDs every word together |
| `websearch_to_tsquery` | user-facing search - supports quotes for phrases, `-` to exclude, `OR` |

```sql
SELECT * FROM articles
WHERE search_vector @@ websearch_to_tsquery('english', 'postgres -mysql "query planner"');
```

---

## Query Operators Inside `to_tsquery`

```sql
to_tsquery('cat & dog')          -- AND: both terms must appear
to_tsquery('cat | dog')            -- OR: either term
to_tsquery('cat & !dog')             -- NOT: cat, but not dog
to_tsquery('cat <-> dog')              -- FOLLOWED BY: "dog" immediately after "cat"
to_tsquery('cat:*')                       -- prefix match: matches "cat", "cats", "catastrophe", etc.
```

---

## Ranking Results by Relevance

```sql
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'postgres & performance') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 10;
```

```sql
ts_rank(search_vector, query)                 -- basic relevance score, based on term frequency
ts_rank_cd(search_vector, query)                 -- "cover density" ranking - also considers term proximity
```

---

## Highlighting Matches

```sql
SELECT ts_headline('english', body, to_tsquery('english', 'postgres'))
FROM articles
WHERE search_vector @@ to_tsquery('english', 'postgres');
```

Returns the matched text with `<b>postgres</b>`-style highlighting (customizable via options) around matching terms - useful for showing search result snippets.

---

## Weighted Search (Prioritize Title Matches over Body Matches)

```sql
UPDATE articles SET search_vector =
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B');
```

Weight labels `A`, `B`, `C`, `D` (highest to lowest) let `ts_rank` factor in which field a match came from - a match in the title (weight `A`) ranks higher than the same term appearing only in the body (weight `B`).

---

## Related
- [[02-Data-Types]]
- [[11-Indexes]]
- [[06-Querying-Select-Where]]
