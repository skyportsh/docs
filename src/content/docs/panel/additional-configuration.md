---
title: Additional Configuration
description: Production tuning for Redis, Octane, workers, and long-running services.
---

Once the panel is installed and reachable through Nginx, you should finish the production setup.

## Recommended `.env` values

The default environment file is intentionally conservative. For production, the most common setup is:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://panel.example.com

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=skyport
DB_USERNAME=skyport
DB_PASSWORD=change-me

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null

LOG_CHANNEL=stack
LOG_LEVEL=info

OCTANE_SERVER=swoole
```

## Octane service

Create `/etc/systemd/system/skyport-panel.service`:

```ini
[Unit]
Description=Skyport Panel (Laravel Octane)
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/skyport
ExecStart=/usr/bin/php artisan octane:start --server=swoole --host=127.0.0.1 --port=8000 --workers=auto --task-workers=auto --max-requests=500
Restart=always
RestartSec=5
Environment=APP_ENV=production

[Install]
WantedBy=multi-user.target
```

## Queue worker service

Create `/etc/systemd/system/skyport-queue.service`:

```ini
[Unit]
Description=Skyport Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/skyport
ExecStart=/usr/bin/php artisan queue:work --tries=1 --timeout=0
Restart=always
RestartSec=5
Environment=APP_ENV=production

[Install]
WantedBy=multi-user.target
```

## Enable and start services

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now skyport-panel.service skyport-queue.service
```

## File ownership

A safe baseline is to make the web user own the app directory:

```bash
sudo chown -R www-data:www-data /var/www/skyport
```

## Useful maintenance commands

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Run those after major environment changes or deployments.

## Logging

When debugging production issues, start with:

```bash
journalctl -u skyport-panel -u skyport-queue -f
```

And Laravel's application log:

```bash
tail -f /var/www/skyport/storage/logs/laravel.log
```

## Redis recommendations

If you use Redis for cache, sessions, and queues, keep it local or private to your trusted network. Do not expose Redis directly to the internet.

## Database recommendations

Use PostgreSQL for production unless you have a strong reason not to. SQLite is fine for local development, but PostgreSQL will be a much better default for real deployments.
