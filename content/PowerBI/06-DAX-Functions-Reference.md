---
title: DAX Functions Reference
tags: [powerbi, dax, functions]
aliases: [DAX functions, SUMX, RELATED, FILTER]
---

# DAX Functions Reference

> [!abstract] Definition
> A categorized reference of the most commonly used DAX functions outside of time intelligence (covered separately in [[07-DAX-Time-Intelligence-Context]]) - aggregation, logical, text, date/time, and relationship-navigation functions.

---

## Aggregation Functions

```dax
SUM(Sales[Amount])
AVERAGE(Sales[Amount])
MIN(Sales[Amount]) / MAX(Sales[Amount])
COUNT(Sales[OrderID])              -- counts non-blank numeric/date/text values
COUNTA(Sales[OrderID])                -- counts non-blank values of ANY type
COUNTROWS(Sales)                        -- counts rows in a table, ignoring column content entirely
DISTINCTCOUNT(Sales[CustomerID])          -- count of unique values
COUNTBLANK(Sales[Discount])                 -- count of blank/null values
```

| Function | Counts |
|---|---|
| `COUNT` | non-blank rows in a numeric/date/text column, EXCLUDING errors |
| `COUNTA` | non-blank rows of any data type |
| `COUNTROWS` | total rows in a table expression, regardless of column values |
| `DISTINCTCOUNT` | unique values in a column |

---

## Logical Functions

```dax
IF(condition, value_if_true, value_if_false)
IF(Sales[Amount] > 1000, "High", "Low")

IFERROR(expression, value_if_error)
IFERROR([Total Sales] / [Order Count], 0)

SWITCH(expression, value1, result1, value2, result2, ..., default)
SWITCH(TRUE(),
    Sales[Amount] > 10000, "Platinum",
    Sales[Amount] > 5000, "Gold",
    Sales[Amount] > 1000, "Silver",
    "Bronze"
)

AND(condition1, condition2)          -- equivalent to &&
OR(condition1, condition2)             -- equivalent to ||
NOT(condition)
ISBLANK(value)
```

> [!tip] `SWITCH(TRUE(), ...)` for multi-branch logic
> This pattern (using `TRUE()` as the expression, then a series of conditions) is DAX's cleanest way to express nested if/elif/elif/else logic - much more readable than deeply nested `IF()` calls.

---

## Text Functions

```dax
CONCATENATE(text1, text2)              -- or just use &
LEFT(text, num_chars) / RIGHT(text, num_chars)
MID(text, start_pos, num_chars)
LEN(text)
UPPER(text) / LOWER(text)
TRIM(text)
SUBSTITUTE(text, old_text, new_text)
FIND(find_text, within_text)               -- case-sensitive search, returns position
SEARCH(find_text, within_text)               -- case-insensitive search, returns position
FORMAT(value, format_string)                   -- format a number/date as text
```

```dax
FORMAT([Total Sales], "$#,##0.00")     -- "$1,234.56"
FORMAT(TODAY(), "DD-MMM-YYYY")           -- "06-Aug-2026"
FORMAT([Growth %], "0.0%")                 -- "12.3%"
```

---

## Date & Time Functions (Non-Time-Intelligence)

```dax
TODAY()
NOW()
YEAR(date) / MONTH(date) / DAY(date)
WEEKDAY(date)
DATEDIFF(start_date, end_date, DAY)      -- also supports MONTH, YEAR, QUARTER, etc.
DATE(year, month, day)
EOMONTH(date, months_to_shift)             -- end of month, optionally shifted forward/back
```

```dax
Days Since Order = DATEDIFF(Sales[OrderDate], TODAY(), DAY)
```

---

## Relationship-Navigation Functions

```dax
RELATED(Table[Column])          -- pull a value from the "one" side of a relationship, INTO the "many" side
RELATEDTABLE(Table)                -- from the "one" side, get all related rows from the "many" side as a table
```

```dax
-- In a Sales (many) row, pull the Customer's Region (one side) via the relationship
Customer Region = RELATED(Customers[Region])

-- In a Customers (one) row, count how many related Sales rows exist
Order Count = COUNTROWS(RELATEDTABLE(Sales))
```

> [!info] `RELATED` vs `RELATEDTABLE`
> `RELATED` goes from many-side to one-side (returns a single value). `RELATEDTABLE` goes from one-side to many-side (returns a table of matching rows) - the direction matters and matches your relationship's cardinality.

---

## `FILTER` - Building a Filtered Table Expression

```dax
High Value Orders = COUNTROWS(FILTER(Sales, Sales[Amount] > 1000))

Total High Value Sales = SUMX(FILTER(Sales, Sales[Amount] > 1000), Sales[Amount])
```

> [!tip] `FILTER` returns a TABLE, not a value
> It's almost always used as an argument to another function (`CALCULATE`, `COUNTROWS`, `SUMX`) rather than on its own - it builds a filtered subset of rows for that outer function to operate on.

---

## `ALL`, `ALLEXCEPT`, `ALLSELECTED` - Removing Filters

```dax
% of Total = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Sales)))

-- Keep the CustomerID filter, but remove all OTHER filters on the Sales table
Sales Ignoring Date = CALCULATE([Total Sales], ALLEXCEPT(Sales, Sales[CustomerID]))

-- Respect explicit slicer selections, but ignore visual-level cross-filtering
Selected Total = CALCULATE([Total Sales], ALLSELECTED(Sales))
```

| Function | Removes |
|---|---|
| `ALL(table)` | every filter on the table (used for "% of grand total" calculations) |
| `ALL(column)` | filters on just that one column |
| `ALLEXCEPT(table, column)` | every filter EXCEPT the one(s) on the specified column(s) |
| `ALLSELECTED(table)` | filters from inside the visual, but keeps external slicer/page-level selections |

> [!info] See [[07-DAX-Time-Intelligence-Context]] for `CALCULATE`, which is what actually applies/modifies filter context using these functions.

---

## Ranking Functions

```dax
Sales Rank = RANKX(ALL(Customers), [Total Sales], , DESC, DENSE)
```

```dax
RANKX(table, expression, [value], [order], [ties])
```

| Argument | Meaning |
|---|---|
| `table` | the set of rows to rank across, e.g. `ALL(Customers)` for ranking against every customer regardless of filters |
| `expression` | what to rank by, e.g. `[Total Sales]` |
| `order` | `ASC` or `DESC` (default is `DESC`) |
| `ties` | `SKIP` (default, like SQL `RANK`) or `DENSE` (like SQL `DENSE_RANK`) |

---

## `TOPN` - Top N Rows by a Measure

```dax
Top 5 Customers by Sales = TOPN(5, Customers, [Total Sales], DESC)
```

---

## Table Functions

```dax
VALUES(Table[Column])              -- distinct values currently visible in filter context, as a table
DISTINCT(Table[Column])              -- similar to VALUES, but excludes an implicit blank row in some edge cases
SUMMARIZE(table, groupby_col, "New Col", expression)   -- SQL GROUP BY-like summarization
ADDCOLUMNS(table, "New Col", expression)                  -- add a computed column to a table expression
SELECTEDVALUE(Table[Column], alternate_result)              -- single selected value from a slicer, or a fallback if none/multiple selected
```

```dax
Selected Region = SELECTEDVALUE(Region[RegionName], "All Regions")
```

> [!tip] `SELECTEDVALUE` for dynamic titles/labels
> A classic pattern: a card or title showing "Sales for: [Selected Region]" that dynamically updates based on a slicer, falling back to a sensible default when nothing (or multiple things) are selected.

---

## Related
- [[05-DAX-Fundamentals]]
- [[07-DAX-Time-Intelligence-Context]]
- [[PowerBI/17-Common-Errors-Gotchas]]
