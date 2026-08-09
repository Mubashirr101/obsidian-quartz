# Syntax

```sql
# Skips the first 5 rows and displays all the rows from 6th onwards
SELECT * FROM person OFFSET 5;

# Skips the first 5 rows and displays the next 2 rows only (6th & 7th)
SELECT * FROM person OFFSET 5 LIMIT 2;
```
# Description

The ‘OFFSET’ keyword skips the amount of rows specified
