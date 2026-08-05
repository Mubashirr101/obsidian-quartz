# Syntax

```sql
# will work for all cases of the character 'p', Lowercase (p) and Uppercase (P)
SELECT * FROM person WHERE email ILIKE 'p%';
```
# Description

Just like the ‘LIKE’ keyword, the ‘ILIKE’ keyword is also used to match patterns in the value / datapoint of the column used to filter in the 'WHERE’ clause.
NOTE : It is NOT case sensitive