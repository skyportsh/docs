---
title: About
description: What Skyport is, how it works, and how the pieces fit together.
---

Skyport is a game server management platform designed for self-hosted deployments.

## Architecture

The project follows the same model familiar from Pterodactyl:

- A **central panel** for users, administrators, and server management
- One or more **nodes** that host game server workloads
- A **daemon** on each node that manages Docker containers on behalf of the panel

### Panel

The panel is a modern Laravel application:

| Layer | Technology |
| --- | --- |
| Backend | Laravel 13, PHP 8.4 |
| Frontend | React 19, Inertia.js v2, Tailwind CSS v4 |
| Build | Vite, Bun |
| App server | Laravel Octane + Swoole |
| SSR | Inertia server-side rendering (Node.js) |
| Database | SQLite (default) or MySQL/MariaDB |

### skyportd

The daemon is a Rust binary that handles:

- Node enrollment with the panel
- Configuration sync
- API serving for the panel
- WebSocket sessions for live console interaction
- Docker container lifecycle management
- Local state persistence (SQLite)

Supported architectures: **x86_64**, **aarch64** (ARM64), **riscv64**.

## Request flow

1. Administrator creates a location and node in the panel
2. Panel generates a one-time configuration token
3. `skyportd` enrolls with the panel using the token
4. Panel syncs server definitions to the daemon
5. Daemon manages Docker containers for each server
6. Users interact with their servers through the panel UI

## Deployment

A typical small deployment:

- One panel VM (runs the web app, database, and queue worker)
- One or more node machines (each running `skyportd` and Docker)

For larger setups, separate the database and use Redis for cache/sessions/queues.

## Comparison with Pterodactyl

If you are coming from Pterodactyl:

| Pterodactyl | Skyport |
| --- | --- |
| Egg | Cargo |
| Wings | skyportd |
| Blade templates | React + Inertia SSR |
| PHP-FPM + Nginx | Octane (Swoole) + Nginx |
| MySQL required | SQLite default, MySQL optional |

## Current expectations

Skyport is intended for administrators comfortable with self-hosting. It assumes you can:

- Secure Linux hosts
- Manage reverse proxies and TLS
- Read application and service logs
- Operate Docker-based infrastructure
