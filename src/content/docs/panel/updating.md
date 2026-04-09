---
title: Updating the Panel
description: Safely update the Skyport panel to a new version.
---

Before updating, read the release notes for the version you are moving to.

## 1. Back up your data

At minimum, back up:

- Your database (SQLite file or MySQL dump)
- `.env`
- Any custom Nginx or service files

## 2. Enter maintenance mode

```bash
cd /var/www/skyport
php artisan down
```

## 3. Pull the new code

```bash
git fetch --all --tags
git pull --ff-only
```

## 4. Update dependencies and rebuild

```bash
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
bun install
bun run build:ssr
```

:::note
Always use `build:ssr` to rebuild both the client and server-side rendering bundles.
:::

## 5. Run database migrations

```bash
php artisan migrate --force
```

## 6. Regenerate routes

```bash
php artisan wayfinder:generate --with-form --no-interaction
```

## 7. Clear caches

```bash
php artisan optimize:clear
```

## 8. Restart services

```bash
sudo systemctl restart skyport-panel skyport-queue skyport-ssr
```

## 9. Exit maintenance mode

```bash
php artisan up
```

## Also update your daemons

Keep `skyportd` close to the panel version. The daemon performs compatibility checks, so mismatched versions may cause enrollment or sync failures.

See [Upgrading skyportd](/daemon/upgrading/).
