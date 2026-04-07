---
title: Setting up PostgreSQL
description: Create a PostgreSQL database and user for the Skyport panel.
---

Skyport can talk to several databases through Laravel, but **PostgreSQL is the recommended production choice**.

## 1. Install PostgreSQL

On Debian or Ubuntu:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

## 2. Create a database and user

Switch to the PostgreSQL superuser:

```bash
sudo -u postgres psql
```

Then run:

```sql
CREATE DATABASE skyport;
CREATE USER skyport WITH ENCRYPTED PASSWORD 'change-me';
GRANT ALL PRIVILEGES ON DATABASE skyport TO skyport;
```

Then exit with:

```sql
\q
```

## 3. Configure the panel `.env`

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=skyport
DB_USERNAME=skyport
DB_PASSWORD=change-me
```

## 4. Run migrations

```bash
php artisan migrate --force
```

## 5. Test the connection

```bash
php artisan tinker
```

```php
DB::connection()->getPdo();
```

If that succeeds without an exception, the panel can reach PostgreSQL correctly.

## Recommendation

For production, keep PostgreSQL on a private interface or private network, not exposed to the public internet.
