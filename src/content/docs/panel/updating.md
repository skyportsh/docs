---
title: Updating the Panel
description: Safely update the Skyport panel and restart supporting services.
---

Before updating, read the release notes for the version you are moving to.

## Recommended update flow

## 1. Back up your data

At minimum, back up:

- your database
- `.env`
- any custom reverse proxy or service files
- uploaded or generated assets if you store them locally

## 2. Put the panel into maintenance mode

```bash
cd /var/www/skyport
php artisan down
```

## 3. Pull the new code

```bash
git fetch --all --tags
git pull --ff-only
```

## 4. Update dependencies and build assets

```bash
composer install --no-dev --optimize-autoloader
bun install --frozen-lockfile
bun run build
```

## 5. Run database migrations

```bash
php artisan migrate --force
```

## 6. Refresh caches

```bash
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 7. Restart services

```bash
sudo systemctl restart skyport-panel.service
sudo systemctl restart skyport-queue.service
```

## 8. Bring the panel back online

```bash
php artisan up
```

## Also update your daemons

Do not leave `skyportd` far behind the panel version. The daemon performs compatibility checks during enrollment and runtime sync, so matching release lines are strongly recommended.

See [Upgrading skyportd](/daemon/upgrading/).
