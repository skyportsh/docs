---
title: Additional Configuration
description: Set up systemd services, environment tuning, and maintenance commands.
---

:::note
If you used the automatic installer, all three services are already created and running. This page is for manual installations and reference.
:::

## Systemd services

The panel needs three long-running processes in production:

### Octane (application server)

Create `/etc/systemd/system/skyport-panel.service`:

```ini
[Unit]
Description=Skyport Panel (Octane)
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/skyport
ExecStart=/usr/bin/php artisan octane:start --server=swoole --host=127.0.0.1 --port=8000
ExecReload=/usr/bin/php artisan octane:reload
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Queue worker

Create `/etc/systemd/system/skyport-queue.service`:

```ini
[Unit]
Description=Skyport Queue Worker
After=network.target skyport-panel.service

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/skyport
ExecStart=/usr/bin/php artisan queue:work --tries=3 --timeout=60
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Inertia SSR

Create `/etc/systemd/system/skyport-ssr.service`:

```ini
[Unit]
Description=Skyport Inertia SSR
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/skyport
ExecStart=/usr/bin/php artisan inertia:start-ssr
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### Enable and start all three

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now skyport-panel skyport-queue skyport-ssr
```

## Environment reference

A complete production `.env` with all important values:

```dotenv
APP_NAME=Skyport
APP_ENV=production
APP_DEBUG=false
APP_URL=https://panel.example.com

DB_CONNECTION=sqlite

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

OCTANE_SERVER=swoole
TRUSTED_PROXIES=*
ASSET_URL=https://panel.example.com

LOG_CHANNEL=stack
LOG_LEVEL=info
```

### Using MySQL instead of SQLite

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skyport
DB_USERNAME=skyport
DB_PASSWORD=your-password
```

### Using Redis for cache/sessions/queues

If you want better performance on high-traffic panels, install Redis and set:

```dotenv
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

## Artisan commands

### Create a user

```bash
php artisan user:create --name="Admin" --email="admin@example.com" --password="Password" --admin --no-interaction
```

Without `--no-interaction`, the command will prompt for each field interactively.

### Configure the environment

```bash
php artisan environment:setup --url="https://panel.example.com" --db-connection=sqlite --no-interaction
```

### Maintenance mode

```bash
php artisan down    # enable maintenance mode
php artisan up      # disable maintenance mode
```

### Clear caches

```bash
php artisan optimize:clear
```

## Logging

Service logs:

```bash
journalctl -u skyport-panel -f
journalctl -u skyport-queue -f
journalctl -u skyport-ssr -f
```

Application log:

```bash
tail -f /var/www/skyport/storage/logs/laravel.log
```
