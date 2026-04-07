---
title: Troubleshooting
description: Common Skyport panel issues and the first places to look.
---

This page covers common panel-side problems.

## 502 Bad Gateway from Nginx

Usually this means Octane is not running or not listening where Nginx expects it.

Check:

```bash
sudo systemctl status skyport-panel.service
journalctl -u skyport-panel -n 100 --no-pager
ss -ltnp | grep 8000
```

## Assets look broken after an update

Rebuild frontend assets and clear caches:

```bash
bun install --frozen-lockfile
bun run build
php artisan optimize:clear
```

## Queue jobs are stuck

Check the queue worker service:

```bash
sudo systemctl status skyport-queue.service
journalctl -u skyport-queue -n 100 --no-pager
```

If you are using Redis, also verify Redis is reachable.

## Database connection errors

Verify:

- `DB_CONNECTION=pgsql`
- host, port, username, and password are correct
- PostgreSQL is listening
- the `skyport` database exists

A quick connectivity check can save time:

```bash
php artisan tinker
```

```php
DB::connection()->getPdo();
```

## Login, cookies, or CSRF issues behind a proxy

Usually one of these is wrong:

- `APP_URL`
- forwarded HTTPS headers
- inconsistent domain names between browser and panel config

## The panel loads, but nodes stay offline

That is usually a daemon-side issue, not a panel rendering issue.

Check:

- that the node was enrolled successfully
- that the daemon secret was stored
- that the node FQDN and ports are correct
- that the daemon can reach the panel URL

## Useful logs

Panel application log:

```bash
tail -f /var/www/skyport/storage/logs/laravel.log
```

Systemd service logs:

```bash
journalctl -u skyport-panel -u skyport-queue -f
```

## If you still need help

When asking for help, include:

- your panel version
- your `skyportd` version
- relevant logs
- your OS version
- whether the issue happens during install, enrollment, or runtime
