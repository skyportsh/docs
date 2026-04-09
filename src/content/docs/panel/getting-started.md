---
title: Getting Started
description: Install the Skyport panel using the automatic installer or a manual setup.
---

## Automatic installation (recommended)

The fastest way to install the panel is with the official installer script. It handles all dependencies, configuration, and service setup interactively.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-panel.sh)
```

The installer will ask you to choose:

- **Release channel** — stable (latest release) or bleeding edge (main branch)
- **Web configuration** — domain with Let's Encrypt SSL, or a plain port
- **Database** — SQLite (simple, zero setup) or MySQL/MariaDB
- **Admin account** — name, email, and password for the first admin user

Once complete, the installer sets up three systemd services:

| Service | Purpose |
| --- | --- |
| `skyport-panel` | Laravel Octane (Swoole) on port 8000 |
| `skyport-queue` | Background job processing |
| `skyport-ssr` | Inertia server-side rendering |

It also configures Nginx as a reverse proxy with optional SSL.

After the installer finishes, your panel is live and you can log in immediately.

---

## Manual installation

If you prefer to install everything yourself, follow the steps below.

### Requirements

- **Ubuntu 22.04/24.04** or **Debian 11/12/13**
- **PHP 8.4** with extensions: cli, curl, mbstring, xml, zip, bcmath, sqlite3, mysql, swoole, gd, intl
- **Composer 2**
- **Bun 1.3+**
- **Node.js 22+** (for Inertia SSR)
- **Nginx**

### 1. Install system packages

**Ubuntu:**

```bash
sudo apt update
sudo apt install -y software-properties-common curl git unzip nginx
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4-cli php8.4-common php8.4-curl php8.4-mbstring \
    php8.4-xml php8.4-zip php8.4-bcmath php8.4-sqlite3 php8.4-mysql \
    php8.4-swoole php8.4-readline php8.4-gd php8.4-intl
```

**Debian:**

```bash
sudo apt update
sudo apt install -y curl git unzip nginx apt-transport-https gnupg2 ca-certificates lsb-release
curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /usr/share/keyrings/sury-php.gpg
echo "deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list
sudo apt update
sudo apt install -y php8.4-cli php8.4-common php8.4-curl php8.4-mbstring \
    php8.4-xml php8.4-zip php8.4-bcmath php8.4-sqlite3 php8.4-mysql \
    php8.4-swoole php8.4-readline php8.4-gd php8.4-intl
```

### 2. Install Composer, Bun, and Node.js

```bash
# Composer
curl -fsSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Bun
curl -fsSL https://bun.sh/install | bash
sudo ln -sf ~/.bun/bin/bun /usr/local/bin/bun

# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs
```

### 3. Download the panel

```bash
sudo mkdir -p /var/www/skyport
cd /var/www/skyport
sudo git clone --depth 1 https://github.com/skyportsh/panel.git .
```

### 4. Install dependencies

```bash
sudo COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
sudo bun install
```

### 5. Configure the environment

```bash
sudo cp .env.example .env
sudo php artisan key:generate --no-interaction
```

Edit `.env` for production:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://panel.example.com

DB_CONNECTION=sqlite

OCTANE_SERVER=swoole
TRUSTED_PROXIES=*
ASSET_URL=https://panel.example.com
```

For MySQL instead of SQLite, set:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skyport
DB_USERNAME=skyport
DB_PASSWORD=your-password
```

For SQLite, create the database file:

```bash
sudo touch database/database.sqlite
```

### 6. Run migrations and build assets

```bash
sudo php artisan migrate --force --no-interaction
sudo php artisan wayfinder:generate --with-form --no-interaction
sudo bun run build:ssr
```

:::note
Use `build:ssr` (not `build`) to generate both the client bundle and the server-side rendering bundle.
:::

### 7. Create an admin user

```bash
sudo php artisan user:create --name="Admin" --email="admin@example.com" --password="YourPassword" --admin --no-interaction
```

### 8. Set permissions

```bash
sudo chown -R www-data:www-data /var/www/skyport
sudo chmod -R 755 storage bootstrap/cache
```

For SQLite, also ensure the database directory is writable:

```bash
sudo chown www-data:www-data database database/database.sqlite
sudo chmod 775 database
sudo chmod 664 database/database.sqlite
```

### 9. Next steps

Continue with [Webserver Configuration](/panel/webserver-configuration/) to set up Nginx, then [Additional Configuration](/panel/additional-configuration/) for systemd services.
