---
title: Common Errors & Gotchas
tags: [powerbi, debugging, gotchas, dax-errors]
aliases: [circular dependency, blank values, filter context traps]
---

# Common Errors & Gotchas

> [!abstract] Purpose
> A troubleshooting reference for the mistakes, error messages, and conceptual traps that come up most often when building Power BI reports and DAX calculations.

---

## Calculated Column Using a Measure (or Vice Versa, Wrong Way)

```dax
-- Calculated column trying to use filter-context logic - doesn't behave as expected
Column Result = CALCULATE([Total Sales])    -- inside a calculated column, this just repeats the row's own values oddly
```

> [!warning] Calculated columns have ROW context, not filter context
> A calculated column can reference `[Total Sales]` (a measure), but since a column has no filter context of its own, the result is often not what's intended - especially confusing because it doesn't error, it just quietly computes something different than expected. See [[05-DAX-Fundamentals]] for the row vs filter context distinction.

---

## Circular Dependency Error

```
"A circular dependency was detected"
```

> Happens when a calculated column/measure references itself, directly or through a chain of other calculations (A depends on B, B depends on A). Trace the dependency chain via `Model View`'s relationship diagram or by reading each formula carefully - Power BI won't specify exactly where the loop is, only that one exists.

---

## Wrong Total in a Visual (Looks Wrong but "Adds Up" Individually)

```dax
-- A ratio measure that looks fine per-row but is WRONG when totaled
Margin % = DIVIDE(SUM(Sales[Profit]), SUM(Sales[Amount]))    -- CORRECT - recalculates properly at every level
```

```dax
-- If instead you average a pre-computed row-level ratio, the TOTAL row is often wrong
Wrong Margin % = AVERAGE(Sales[RowLevelMarginPercent])    -- averages the RATIOS, not the underlying totals - usually incorrect
```

> [!warning] Never average a pre-computed percentage/ratio column for a "total"
> A grand-total row showing the average of individual row-level percentages is almost always mathematically wrong (it ignores weighting by volume). Always recompute the ratio using `DIVIDE(SUM(...), SUM(...))` so it's correct at every level of aggregation, not just the detail rows.

---

## Blank/Missing Rows Due to Relationship Direction

> [!warning] Data "disappears" after adding a relationship
> If a fact table doesn't have a matching row in a dimension table (e.g. a sale with a `CustomerID` not present in the `Customers` table), that row can silently vanish from visuals filtered/grouped by anything from the `Customers` side. Check `Model View` for orphaned foreign keys, and consider whether the relationship should be Left-Outer-like (most fact-to-dimension relationships default to including unmatched rows as a blank category, but verify with `View As`/testing).

---

## `BLANK()` vs `0` vs Empty String Confusion

```dax
Sales When None = CALCULATE([Total Sales], Sales[Region] = "Nonexistent")   -- returns BLANK(), not 0
```

> [!info] DAX distinguishes `BLANK()` from `0`
> Many visuals hide rows/columns where a measure returns `BLANK()` (e.g. a matrix won't show a category with no data at all), but WILL show a row where the measure returns `0`. Use `IF(ISBLANK(x), 0, x)` or `COALESCE(x, 0)` deliberately when you want zeros displayed instead of blank rows disappearing - or leave it as `BLANK()` deliberately when you want sparse categories hidden.

---

## Slicer Not Filtering a Visual as Expected

> [!warning] Usually a relationship problem, not a slicer problem
> If a slicer on Table A doesn't seem to filter a visual built from Table B, check `Model View`: either there's no relationship between them, the relationship is the wrong direction (see [[04-Data-Modeling-Relationships]]), or it's marked inactive. Also check `Edit Interactions` (see [[10-Filters-Slicers-Interactions]]) in case that specific visual was manually set to "None" for that source.

---

## `RELATED` Returns Blank/Error

```dax
Customer Region = RELATED(Customers[Region])
```

> [!warning] `RELATED` only works in the correct direction
> `RELATED` pulls from the "one" side of a many-to-one relationship, used from the "many" side. If used the other way (or if no relationship exists between the two tables at all), it returns `BLANK()` or an error. Use `RELATEDTABLE` instead when going from one-side to many-side (see [[06-DAX-Functions-Reference]]).

---

## Time Intelligence Functions Not Working

> [!warning] Almost always a missing/incorrect Date table
> `TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`, etc. require: (1) a continuous, gap-free calendar table, (2) marked as the official Date table (`Mark as Date Table`), (3) properly related to the fact table, and (4) the date column used inside the function must come from THAT marked date table, not a raw date column on the fact table itself. See [[04-Data-Modeling-Relationships]] and [[07-DAX-Time-Intelligence-Context]].

---

## Refresh Fails in the Service but Works in Desktop

> [!warning] Usually a credentials or gateway issue
> The most common cause: data source credentials were never configured (or have expired) in `Dataset Settings > Data source credentials` in the Service - Desktop uses your own locally cached credentials, which don't automatically transfer to the Service. For on-premises sources, also confirm the gateway (see [[15-Publishing-Power-BI-Service]]) is online and correctly assigned to the dataset.

---

## Visual Shows "Too many values" / "Can't display this visual"

> [!info] Most visuals have a data point limit
> Charts silently truncate or refuse to render beyond a certain number of category values (varies by visual type, often around 10,000-30,000 points). Reduce cardinality on the axis field, apply a Top N filter, or switch to a table/matrix which handles larger row counts more gracefully.

---

## Report Runs Fine in Desktop but Slow in the Service

> [!info] Check whether it's actually DirectQuery or a capacity/gateway bottleneck
> A report that feels fast locally (against a fast local connection) can be slow once published if it relies on DirectQuery against a source now being queried from the cloud, or if the workspace is on a shared/constrained capacity. Use Performance Analyzer (see [[16-Performance-Optimization]]) in the Service context, not just Desktop, to diagnose.

---

## Duplicate Values Appearing After a Merge/Join

> [!warning] Usually caused by a non-unique join key
> If the "one" side of an intended many-to-one relationship (or Power Query merge) actually has duplicate keys, matching rows multiply unexpectedly (the same "many-to-many" row explosion problem as in SQL - see [[DBMS/PostgreSql/19-Common-Errors-Gotchas|PostgreSQL: Common Errors]]). Check for duplicates on the key column (`Remove Duplicates` in Power Query, or `DISTINCTCOUNT` vs `COUNTROWS` in DAX) before relying on a relationship being truly one-to-many.

---

## Related
- [[04-Data-Modeling-Relationships]]
- [[05-DAX-Fundamentals]]
- [[07-DAX-Time-Intelligence-Context]]
- [[16-Performance-Optimization]]
