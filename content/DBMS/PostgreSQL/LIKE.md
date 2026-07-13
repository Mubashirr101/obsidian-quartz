# Syntax

```sql
# only display rows having emails ending with 'archive.org'
SELECT * FROM person WHERE email LIKE '%archive.org';

# displays rows having emails that have the word 'google' in it anywhere
SELECT * FROM person WHERE email LIKE '%google%';

# displays rows having emails that are 4 chars in length, excluding the domain (abcd@gmail.com)
SELECT * FROM person WHERE email LIKE '____@%';
```
# Description

Used to match patterns in the value / datapoint of the column used to filter in the 'WHERE’ clause.
NOTE : It IS case sensitive
