---
title: Introduction
description: Learn how Skyport is structured and how to get your panel and daemon online.
---

Skyport is a modern game server management stack built around two pieces:

- **Skyport Panel** — the web application your users and administrators interact with.
- **skyportd** — the node daemon that runs on your infrastructure and manages server runtime tasks.

If you have used Pterodactyl before, the flow is familiar: install the panel first, create a node, then enroll the daemon and start assigning servers.

## Architecture at a glance

| Component | Purpose | Stack |
| --- | --- | --- |
| Panel | Accounts, admin area, nodes, locations, server management UI | Laravel 13, Inertia, React, Vite, Octane, Swoole |
| skyportd | Node enrollment, runtime sync, Docker orchestration, websocket and API handling | Rust |
| Runtime | The actual game server containers | Docker |

## Recommended production stack

Skyport is still easy to run, but production deployments should follow a fairly standard stack:

- **Ubuntu 24.04 LTS** or **Debian 12**
- **Nginx** as a reverse proxy
- **PHP 8.4** with required extensions
- **Composer 2**
- **Bun 1.3+** for frontend builds
- **PostgreSQL 16+** for the primary database
- **Redis 7+** for cache, sessions, and queues
- **Laravel Octane + Swoole** for serving the panel
- **Docker Engine** on every node running `skyportd`

## Before you begin

Make sure you are comfortable with:

- basic Linux administration
- DNS records and reverse proxies
- service management with `systemd`
- opening and restricting firewall ports
- reading logs when something goes wrong

## Recommended order

1. Read [About](/project/about/)
2. Install the [Panel](/panel/getting-started/)
3. Configure your [webserver](/panel/webserver-configuration/)
4. Create your first [location and node](/guides/first-location-and-node/)
5. Install [skyportd](/daemon/installing/)
6. Finish TLS and production hardening

## Important note on versions

Skyport panel and `skyportd` should be kept on matching release lines. The daemon validates panel compatibility during enrollment, so avoid mixing arbitrary versions across nodes and the panel.

## Need help?

- GitHub: [github.com/skyportsh](https://github.com/skyportsh)
- Support: [Skyport Discord](https://discord.gg/PUuezaSqkY)
