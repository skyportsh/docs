---
title: Webserver Configuration
description: Configure Nginx as a reverse proxy in front of the Skyport panel.
---

:::note
If you used the automatic installer, Nginx is already configured. This page is for manual installations only.
:::

The panel runs on Laravel Octane (Swoole) which listens on `127.0.0.1:8000`. Nginx sits in front as a reverse proxy to handle SSL termination and public traffic.

## With SSL (recommended)

First, obtain a certificate:

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d panel.example.com
```

Then create `/etc/nginx/sites-available/skyport.conf`:

```nginx
server {
    listen 80;
    server_name panel.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name panel.example.com;

    ssl_certificate /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/skyport/public;
    client_max_body_size 256m;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
    }
}
```

## Without SSL (port-based)

Create `/etc/nginx/sites-available/skyport.conf`:

```nginx
server {
    listen 8080;
    server_name _;

    root /var/www/skyport/public;
    client_max_body_size 256m;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
    }
}
```

## Enable the site

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/skyport.conf /etc/nginx/sites-enabled/skyport.conf
sudo nginx -t
sudo systemctl restart nginx
```

## Important `.env` settings

These must be set correctly or assets and links will break:

```dotenv
# Must match your public URL exactly
APP_URL=https://panel.example.com

# Required — tells Laravel to trust the Nginx proxy headers
TRUSTED_PROXIES=*

# Required — ensures SSR renders asset URLs with the correct scheme and host
ASSET_URL=https://panel.example.com
```

Without `TRUSTED_PROXIES`, Laravel won't detect HTTPS behind the proxy. Without `ASSET_URL`, the SSR renderer generates incorrect asset URLs (typically `http://` instead of `https://`), causing mixed content errors.

## Firewall

Open only what you need:

- **80/tcp** and **443/tcp** for the panel
- Do **not** expose port 8000 (Octane) directly

## Behind Cloudflare or another CDN

If you put the panel behind Cloudflare:

- Set `APP_URL` to the public HTTPS URL
- Ensure websocket upgrades are allowed (required for server console)
- Keep `TRUSTED_PROXIES=*` to accept forwarded headers

## Next steps

Continue with [Additional Configuration](/panel/additional-configuration/) to set up systemd services.
