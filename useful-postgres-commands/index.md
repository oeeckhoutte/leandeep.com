# Useful Postgres commands

- Canonical URL: https://leandeep.com/useful-postgres-commands/
- Author: Olivier Eeckhoutte
- Published: 2019-06-21T19:43:00Z
- Updated: 2019-06-21T19:43:00Z
- Language: fr
- Tags: Postgres
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Here is a list of Postgres basic commands:

## Basics

```
\? list all the commands
\l list databases
\conninfo display information about current connection
\c [DBNAME] connect to new database, e.g., \c template1
\dt (list tables of the public schema)
\dt <schema-name>.* list tables of certain schema, e.g., \dt public.*
\dt *.* list tables of all schemas
Then you can run SQL statements, e.g., SELECT * FROM my_table;(Note: a statement must be terminated with semicolon ;)
\d table (Describe table structure)
\q (quit psql)
\i path/to/file.sql (Import data)
\copy (SELECT * FROM utilisateurs) TO 'path/to/file.csv' WITH CSV HEADER; (export data)
SET search_path TO myschema; (Select schema)
SHOW search_path; (See selected schema)
\dn (list schemas OR "SELECT schema_name FROM information_schema.schemata;")
```

> I recommand the usage of pgadmin4 to manage your Postgres Databases.

<br/>

## Install PSQL Client

**On ubuntu**

```
apt-get update
apt-get install -y postgresql-client
```

<br/>

## Database

**Connect to specific local DB**

```
psql your_db your_username
```

<br/>

**Connect to remote DB**

```
psql -h DB_HOST -p DB_PORT DB_NAME DB_USER
```

<br/>

**Dump DB**

```
pg_dump -Fc my_db > /tmp/db.dump

# restore
# pg_restore -d new_db /tmp/db.dump
```

<br/>

**Restore DB:**
```
pg_restore path_to_backup_file.backup --dbname=your_db --username=your_username --clean

# -d <=> --dbname
# -U <=> --username
# --clean = clean (drop) database objects before recreating
```

<br/>

**Create a DB with a particular role:**

```
CREATE DATABASE your_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

<br/>

**Drop DB:**

```
drop database your_db;
```

<br/>

**Close all sessions:**
```
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'you_db';
```

<br/>

**Truncate all tables from DB**

*(It is as if you remove the data but keep the schema.)*

```
# Create Schema dump of database (schema-only)
pg_dump your_db -s > schema.sql

# Drop database
drop database your_db;

# Create Database
create database your_db;

4) Import Schema
psql your_db < schema.sql
```

> In case you want to create a script can execute SQL commands the Terminal using the -c flag: `$ psql -c "YOUR SQL QUERY;"`


<br/>

## Roles vs Users vs Groups

> "CREATE ROLE", "CREATE USER", and "CREATE GROUP" were different couple of years ago. Since group management has changed these 3 commands are (almost) the same. They all still exist for the sake of compatibility.
There is all the same a slight difference between for example "CREATE ROLE" and "CREATE USER". "CREATE ROLE" will create a default user that cannot login (NOLOGIN), even though "CREATE USER" will create a user with the LOGIN attribute. .

<br/>

## Roles

**List roles:**

```
\du

# or 

SELECT
   rolname
FROM
   pg_roles;
```

<br/>

**Create a role:**
```
create role your_role
```

<br/>

## Users

**Create user:**

```
create user your_user with encrypted password 'user_password';
```

<br/>

**Grant all priviledges to user on database:**

```
grant all privileges on database your_db to your_user;
```

<br/>

## Installation

### On Centos 7

```
yum install postgresql-server postgresql-contrib
# Initialize the DB
postgresql-setup initdb
# Start the service
systemctl start postgresql
# Starts with system
systemctl enable postgresql
Change user to postgres and connect to the client to check if it works
su postgres
psql
\l
```

<br/>

### On OSX

```
brew install postgresql
brew services start postgres
```

<br/>

## Database modeler

It can be very useful to generate the database graph to see all relations betweens tables.

There is a great tool that can help. It is opensource and works perfectly with Postgres 11+. It is called pgmodeler and it is available here:  https://github.com/pgmodeler/pgmodeler.git

Here is the procedure to install it on OSX. (You need Xcode installed)

```
brew install qt
echo 'export PATH="/usr/local/opt/qt/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
git clone https://github.com/pgmodeler/pgmodeler.git
cd pgmodeler
git checkout the_latest_tag
# Edit the file pgmodeler.pri and replace the variables `PGSQL_LIB = /Library/PostgreSQL/11/lib/libpq.dylib` and `PGSQL_INC = /Library/PostgreSQL/11/include` with respectively `PGSQL_LIB = /usr/local/Cellar/postgresql/11.4/lib/libpq.dylib` and `PGSQL_INC = /usr/local/Cellar/postgresql/11.4/include`
qmake -r CONFIG+=release pgmodeler.pro
make && make install
open /Applications/pgmodeler.app
```

<br/>

## Great Python ORM

**SQLAlchemy** is a great Python ORM. 
Here are few useful links to manage to model your Postgres DB using Python and this library:
https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html


