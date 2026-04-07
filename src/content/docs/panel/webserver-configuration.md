---
title: Webserver Configuration
description: Put Nginx in front of the Skyport panel and serve Octane safely in production.
---

The Skyport panel should normally run behind a reverse proxy.

A common production layout is:

- Nginx listening on **80/443**
- Octane listening on **127.0.0.1:8000**
- TLS terminated by Nginx

## Why proxy Octane?

This keeps your public edge simple while allowing Octane and Swoole to stay on a private loopback port.

## Example Nginx configuration

Update paths and domains to match your environment.

```nginx
server {
    listen 80;
    server_name panel.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name panel.example.com;

    root /var/www/skyport/public;
    index index.php;

    ssl_certificate /etc/letsencrypt/live/panel.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/panel.example.com/privkey.pem;

    client_max_body_size 100m;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:8000;
    }

    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }
}
```

## Things to verify

After reloading Nginx, verify that:

- `https://panel.example.com` loads
- static assets load correctly
- login and registration pages work
- websocket and long-running requests are not blocked

## Firewall guidance

Open only what you need publicly on the panel host:

- `80/tcp`
- `443/tcp`

Do **not** expose the Octane port publicly unless you have a specific reason to.

## If you are behind Cloudflare or another proxy

Make sure:

- `APP_URL` matches the public HTTPS URL
- forwarded headers are passed correctly
- websocket upgrades are allowed

## After the webserver is working

Continue with [Additional Configuration](/panel/additional-configuration/) to set up service units and production process management.
