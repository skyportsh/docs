---
title: Getting Started
description: Install the Skyport panel for a production deployment.
---

This guide covers a recommended production-style installation of the Skyport panel.

## Recommended software versions

- **Ubuntu 24.04 LTS** or **Debian 12**
- **PHP 8.4**
- **Composer 2**
- **Bun 1.3+**
- **PostgreSQL 16+**
- **Redis 7+**
- **Nginx**
- **Laravel Octane with Swoole**

## Recommended architecture

For production, we strongly recommend:

- **PostgreSQL** as the main database
- **Redis** for cache, sessions, and queues
- **Octane + Swoole** behind Nginx
- a dedicated machine or VM for each node daemon

## Required PHP extensions

Install the standard Laravel extensions plus the ones commonly needed for this stack:

- `bcmath`
- `curl`
- `ctype`
- `dom`
- `fileinfo`
- `mbstring`
- `openssl`
- `pcntl`
- `pdo_pgsql`
- `redis`
- `session`
- `tokenizer`
- `xml`
- `zip`
- `swoole`

## 1. Install system packages

The exact package names vary by distribution, but your host should have:

```bash
sudo apt update
sudo apt install -y git unzip curl ca-certificates nginx redis-server postgresql postgresql-contrib
```

Then install PHP 8.4, Composer, Bun, and the Swoole extension using your preferred package sources.

## 2. Clone the panel

```bash
sudo mkdir -p /var/www/skyport
sudo chown "$USER":"$USER" /var/www/skyport
cd /var/www/skyport

git clone https://github.com/skyportsh/panel.git .
```

## 3. Install PHP and frontend dependencies

```bash
composer install --no-dev --optimize-autoloader
bun install --frozen-lockfile
```

## 4. Create your environment file

```bash
cp .env.example .env
```

At minimum, update these values for production:

```dotenv
APP_NAME=Skyport
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

## 5. Generate the application key and migrate

```bash
php artisan key:generate
php artisan migrate --force
```

## 6. Build assets

```bash
bun run build
```

## 7. Start the panel with Octane

For a first boot test:

```bash
php artisan octane:start --server=swoole --host=127.0.0.1 --port=8000
```

If the app loads on port `8000`, continue to the webserver configuration step and place Nginx in front of it.

## 8. Create your first account

Skyport includes a registration flow, so you can create the first account through the web UI at `/register`.

If you need to promote that first user to admin manually, use Tinker:

```bash
php artisan tinker
```

```php
$user = App\Models\User::where('email', 'you@example.com')->first();
$user->is_admin = true;
$user->save();
```

## 9. Keep the queue running

Even if the panel boots successfully, background work still needs a worker process in production.

A simple foreground check:

```bash
php artisan queue:work --tries=1 --timeout=0
```

You will convert this into a `systemd` service in [Additional Configuration](/panel/additional-configuration/).

## Next step

Continue with [Webserver Configuration](/panel/webserver-configuration/).
