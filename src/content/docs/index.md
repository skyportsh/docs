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

## Quick start

The fastest way to get Skyport running is with the automatic installers:

```bash
# Install the panel
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-panel.sh)

# Install the daemon (on a node machine)
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-daemon.sh)
```

The installers handle all dependencies, configuration, SSL, and service setup interactively. They support **Ubuntu 22.04/24.04** and **Debian 11/12/13**.

If you prefer a manual installation, follow the step-by-step guides below.

## Supported operating systems

| OS | Versions |
| --- | --- |
| Ubuntu | 22.04 LTS, 24.04 LTS |
| Debian | 11, 12, 13 |

## Production stack

| Component | Details |
| --- | --- |
| PHP | 8.4 with Swoole extension |
| Web server | Nginx (reverse proxy to Octane) |
| App server | Laravel Octane + Swoole |
| SSR | Inertia SSR (Node.js) |
| Frontend | Bun for builds, React + Vite |
| Database | SQLite (default) or MySQL/MariaDB |
| Queue/Cache | Database driver (default) or Redis |
| Daemon | Rust binary — x86_64, aarch64, riscv64 |
| Containers | Docker Engine on each node |

## Recommended order

1. Read [About](/project/about/) to understand the architecture
2. Install the [Panel](/panel/getting-started/) (automatic or manual)
3. Configure your [webserver](/panel/webserver-configuration/) (manual installs only)
4. Create your first [location and node](/guides/first-location-and-node/)
5. Install [skyportd](/daemon/installing/) on your node machine
6. Create your first server

## Important note on versions

The panel and `skyportd` should be kept on matching release lines. The daemon validates panel compatibility during enrollment, so avoid mixing arbitrary versions.

## Need help?

- GitHub: [github.com/skyportsh](https://github.com/skyportsh)
- Discord: [discord.gg/PUuezaSqkY](https://discord.gg/PUuezaSqkY)
