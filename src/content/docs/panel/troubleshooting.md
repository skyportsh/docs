---
title: Troubleshooting
description: Common panel issues and how to fix them.
---

## 502 Bad Gateway

Octane is not running or not listening where Nginx expects.

```bash
systemctl status skyport-panel
journalctl -u skyport-panel -n 50
ss -ltnp | grep 8000
```

## Assets not loading / mixed content errors

This almost always means `ASSET_URL` or `TRUSTED_PROXIES` is not set correctly in `.env`:

```dotenv
APP_URL=https://panel.example.com
ASSET_URL=https://panel.example.com
TRUSTED_PROXIES=*
```

After changing `.env`, restart Octane and SSR:

```bash
systemctl restart skyport-panel skyport-ssr
```

## Blank page with no errors

The SSR service may not be running or the SSR bundle may be missing:

```bash
systemctl status skyport-ssr
journalctl -u skyport-ssr -n 20
```

If you see "Inertia SSR bundle not found", rebuild assets with:

```bash
bun run build:ssr
systemctl restart skyport-ssr
```

## Assets broken after an update

Rebuild and clear caches:

```bash
bun install
bun run build:ssr
php artisan optimize:clear
systemctl restart skyport-panel skyport-ssr
```

## Queue jobs stuck

```bash
systemctl status skyport-queue
journalctl -u skyport-queue -n 50
```

Restart the worker:

```bash
systemctl restart skyport-queue
```

## Database connection errors

Verify your `.env` settings match your actual database:

```bash
php artisan tinker --execute "DB::connection()->getPdo(); echo 'OK';"
```

For SQLite, make sure the file exists and is writable by `www-data`:

```bash
ls -la database/database.sqlite
```

## Login or CSRF errors behind a proxy

Check that:

- `APP_URL` matches the URL in your browser exactly
- `TRUSTED_PROXIES=*` is set
- Your proxy passes `X-Forwarded-Proto` and `X-Forwarded-For` headers

## Nodes always show as offline

This is usually a daemon-side issue, not a panel problem:

- Check that `skyportd` is running on the node
- Verify the node was enrolled successfully
- Confirm the FQDN and ports are correct
- Make sure the daemon can reach the panel URL

## Useful log locations

```bash
# Service logs
journalctl -u skyport-panel -f
journalctl -u skyport-queue -f
journalctl -u skyport-ssr -f

# Application log
tail -f /var/www/skyport/storage/logs/laravel.log
```

## Getting help

When asking for help, include:

- Panel version (check `composer.json`)
- `skyportd` version (`skyportd --help`)
- OS and version
- Relevant log output
- Steps to reproduce
