---
title: Updating the Panel
description: Safely update the Skyport panel to a new version.
---

## Automatic update (recommended)

The fastest way to update is with the official update script:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/update-panel.sh)
```

The script handles everything automatically:

1. Detects whether your installation is git-based (bleeding edge) or release-based (stable)
2. Backs up your database and `.env` to `storage/backups/`
3. Puts the panel in maintenance mode
4. Pulls the latest code
5. Updates PHP and JS dependencies
6. Runs database migrations
7. Rebuilds frontend assets (client + SSR)
8. Clears caches and fixes permissions
9. Restarts all three services
10. Exits maintenance mode

After the update, it shows the previous and current version numbers.

---

## Manual update

If you prefer to update manually, follow these steps.

Before updating, read the release notes for the version you are moving to.

### 1. Back up your data

```bash
cd /var/www/skyport

# SQLite
cp database/database.sqlite database/database.sqlite.bak

# MySQL
mysqldump -u skyport -p skyport > skyport_backup.sql

# Always back up .env
cp .env .env.bak
```

### 2. Enter maintenance mode

```bash
php artisan down
```

### 3. Pull the new code

**Git (bleeding edge):**

```bash
git fetch --all --tags
git reset --hard origin/main
```

**Release (stable):**

Download the latest release tarball and extract it over your installation, preserving `.env`, `database/`, and `storage/`.

### 4. Update dependencies and rebuild

```bash
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
bun install
bun run build:ssr
```

:::note
Always use `build:ssr` to rebuild both the client and SSR bundles.
:::

### 5. Run migrations and regenerate routes

```bash
php artisan migrate --force
php artisan wayfinder:generate --with-form --no-interaction
```

### 6. Clear caches

```bash
php artisan optimize:clear
```

### 7. Fix permissions and restart

```bash
chown -R www-data:www-data /var/www/skyport
chmod -R 755 storage bootstrap/cache
systemctl restart skyport-panel skyport-queue skyport-ssr
```

### 8. Exit maintenance mode

```bash
php artisan up
```

## Also update your daemons

Keep `skyportd` close to the panel version. The daemon performs compatibility checks, so mismatched versions may cause enrollment or sync failures.

See [Upgrading skyportd](/daemon/upgrading/).
