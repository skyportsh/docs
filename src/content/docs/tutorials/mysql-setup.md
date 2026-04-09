---
title: Setting up MySQL
description: Create a MySQL or MariaDB database for the Skyport panel.
---

Skyport uses SQLite by default, which requires zero setup. If you prefer MySQL or MariaDB for a larger deployment, follow this guide.

## 1. Install MariaDB

```bash
sudo apt update
sudo apt install -y mariadb-server
sudo systemctl enable --now mariadb
```

## 2. Create a database and user

```bash
sudo mariadb
```

```sql
CREATE DATABASE skyport;
CREATE USER 'skyport'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON skyport.* TO 'skyport'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Configure the panel

Update `.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skyport
DB_USERNAME=skyport
DB_PASSWORD=your-password
```

Or use the setup command:

```bash
php artisan environment:setup \
    --db-connection=mysql \
    --db-host=127.0.0.1 \
    --db-port=3306 \
    --db-database=skyport \
    --db-username=skyport \
    --db-password=your-password \
    --no-interaction
```

## 4. Run migrations

```bash
php artisan migrate --force
```

## 5. Verify

```bash
php artisan tinker --execute "DB::connection()->getPdo(); echo 'OK';"
```

## Recommendation

Keep MariaDB on a private interface. Do not expose port 3306 to the internet.
