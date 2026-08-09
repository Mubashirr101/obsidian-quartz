**PostgreSQL** is an **open-source relational database management system (RDBMS)** used to store, manage, and retrieve structured data efficiently. It follows the **SQL (Structured Query Language)** standard and supports advanced features such as **transactions, indexing, complex queries, and data integrity constraints**.

It uses a **client–server architecture**, where users interact with the database through tools such as the **psql command-line interface, pgAdmin, or programming languages like Python, Java, and others**.

Because of its **performance, scalability, and powerful features**, PostgreSQL is widely used in **data science, web applications, financial systems, and enterprise software**.

# 1. Starting up a postgre terminal (using cli)

## Steps:
1. From psql shell
	1. Open : SQL Shell (psql) 
	2. Enter credentials (keep them null for default values (i.e. just press enter when asked for credentials)), password is mandatory though.
	3. Enter ‘\l’ command to list all the databases present
2. From any terminal
	1. Command → psql -h localhost -p 5432 -U username dbname
	2. PS: default username is postgres
	
		

# 2. SQL commands :

## Database Commands:
1. [[CREATE DATABASE]] : Creates a database which can contain tables
2. [[slash commands]] → ‘\l’ ,’ \c ‘, ‘\d’ ,’\dt’ ,’\i’ ,’\copy’
3. [[DROP DATABASE ]]: Removes the specified database
## Table Commands :
### 1.  DDL (Data Definition Language):
1. [[CREATE TABLE]] : Creates a table with specified columns , their data types and constrains.
2. [[DROP TABLE]] : Removes the specified table from the database
3. [[ALTER]] : Makes changes in database schema like changes in constraints, etc.
4. [[TRUNCATE]]
### 2. DML (Data Manipulation Language):
1. [[INSERT]] : Enter values in the specified columns of a specified table
2. [[UPDATE]] : Makes changes in the specified table’s rows/columns
3. [[DELETE]] : Permanently deletes a table or parts of it
### 3. DQL (Data Query Language):
1. [[SELECT]] : Display the data which is queried
2. [[ORDER BY]] : Sort the table as per any column, either ascending or descending
3. [[DISTINCT]] : Shows unique entries 
4. [[WHERE]] : This clause is used to filter the query using conditions
5. [[AND]] : Used to club two or more conditions, where both should be true in a single WHERE clause
6. [[OR]] : Used to club two or more conditions, where either one can be true in a single WHERE clause
7. [[Comparison Operators]] : { > , < , <> , = , ≤ , ≥ }
8. [[LIMIT]] : Shows only the specified number of entries
9. [[OFFSET]] : Skips the specified number of entries
10. [[IN]] : Used to add multiple conditional variables in an array
11. [[LIKE]] : Matches a text operator against a pattern, it is case sensitive
12. [[ILIKE]] : Matches a text operator against a pattern, it is not case sensitive
13. [[GROUP BY]] : Used to group data based on a column and can carry out aggregate functions like min, max, sum, count, avg, etc.
14. [[Arithmetic Operators]] : { + , - , * , / , ^ , ! , % , etc. }
15. [[COALESCE]] : Handles null values by giving them a non-null default value
16. [[NULLIF]] : Specifies what to do if there is null, mostly used when handling division by zero
17. [[Timestamp & dates]] : - NOW(), INTERVAL
18. [[EXTRACT]] : Used to extract fields from a date
19. [[Primary Key]] 
20. [[Unique Constraints]]
21. [[ON CONFLICT() DO NOTHING]] : It is a way of error handling for constraint violations upon command run
22. [[UPSERT]] : Its is essentially an update command inside an insert command
23. [[Foreign Key ]]
24. [[INNER JOIN]] : 
25. [[LEFT JOIN]]
26. [[Bigserial & Serial]]
27. [[Extensions]]
28. [[UUID]] : Universally Unique Identifier

