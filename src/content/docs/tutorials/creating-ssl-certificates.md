---
title: Creating SSL Certificates
description: Use Let's Encrypt for the panel and for TLS-enabled daemon nodes.
---

TLS should be treated as standard for production Skyport deployments.

## Panel certificate

If you are using Nginx, Certbot is the quickest path on most Debian and Ubuntu systems:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d panel.example.com
```

After that, verify:

- the certificate paths are present in your Nginx config
- the site redirects HTTP to HTTPS
- `APP_URL` is set to your HTTPS panel URL

## Node certificate for `skyportd`

If you enable SSL for a node in the panel, the daemon expects certificate files for that node FQDN.

The default paths it checks are:

```text
/etc/letsencrypt/live/node.example.com/fullchain.pem
/etc/letsencrypt/live/node.example.com/privkey.pem
```

A common Certbot flow for the node machine is:

```bash
sudo apt install -y certbot
sudo systemctl stop nginx || true
sudo certbot certonly --standalone -d node.example.com
```

## What happens next

When `skyportd` starts on a TLS-enabled node:

- it checks the default Let's Encrypt paths
- if they exist, it saves them automatically
- if they do not exist, it prompts you for custom certificate and key paths

## Renewal

Make sure your certificate renewal process is enabled, especially if you are using standalone Certbot or custom reverse proxies.

A node that loses its valid certificate files may fail to bind correctly on restart.
