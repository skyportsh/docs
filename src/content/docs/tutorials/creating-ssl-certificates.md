---
title: Creating SSL Certificates
description: Set up Let's Encrypt certificates for the panel and daemon nodes.
---

:::note
If you used the automatic installer with a domain, SSL certificates are already configured.
:::

## Panel certificate

Install Certbot and obtain a certificate:

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d panel.example.com
```

If Nginx is already running on port 80, stop it first or use the Nginx plugin:

```bash
sudo apt install -y python3-certbot-nginx
sudo certbot --nginx -d panel.example.com
```

After obtaining the certificate, update your Nginx config to reference:

```text
/etc/letsencrypt/live/panel.example.com/fullchain.pem
/etc/letsencrypt/live/panel.example.com/privkey.pem
```

And set in `.env`:

```dotenv
APP_URL=https://panel.example.com
ASSET_URL=https://panel.example.com
```

## Node certificate for skyportd

If SSL is enabled for a node in the panel, `skyportd` needs certificate files.

On the node machine:

```bash
sudo apt install -y certbot
sudo certbot certonly --standalone -d node.example.com
```

The daemon automatically checks these default paths:

```text
/etc/letsencrypt/live/node.example.com/fullchain.pem
/etc/letsencrypt/live/node.example.com/privkey.pem
```

If the files exist, `skyportd` uses them automatically. If not, it will prompt for custom paths during startup.

## Renewal

Certbot sets up automatic renewal by default. Verify with:

```bash
sudo certbot renew --dry-run
```

Make sure your renewal process can bind to port 80 (standalone) or that Nginx is configured for the challenge.
