---
title: About
description: Understand what Skyport is, how it differs from older panels, and how the pieces fit together.
---

Skyport is a game server management platform designed for self-hosted deployments.

The project follows the same broad model that many administrators already know:

- a **central panel** for users, administrators, billing integrations, and orchestration
- one or more **nodes** that actually host workloads
- a **daemon** on each node that talks back to the panel and manages runtime operations

## What makes Skyport different?

The current Skyport panel is built as a modern Laravel application using:

- **Laravel 13**
- **Inertia.js**
- **React**
- **Vite**
- **Laravel Octane**
- **Swoole**

That means the panel feels much closer to a modern app than a traditional server-rendered admin panel, while still keeping Laravel's deployment and ecosystem advantages.

On the node side, Skyport uses **`skyportd`**, a Rust daemon that handles:

- node enrollment
- configuration sync
- daemon API serving
- websocket sessions for runtime interactions
- Docker-backed lifecycle operations
- local state persistence

## High-level request flow

A typical flow looks like this:

1. An administrator creates a location and node in the panel.
2. The panel generates a one-time configuration token.
3. `skyportd` is started on the node and enrolled against the panel.
4. The daemon stores its runtime configuration locally.
5. The panel syncs server definitions to the daemon.
6. The daemon manages the underlying Docker workloads.

## Recommended deployment shape

For a small deployment, you can run:

- one panel VM
- one PostgreSQL instance
- one Redis instance
- one or more dedicated node machines running `skyportd`

For larger setups, separate the panel, database, and Redis onto their own managed or dedicated infrastructure.

## Current expectations

Skyport is intended for administrators who are comfortable with self-hosting. It is not a managed SaaS, and it assumes you can:

- secure Linux hosts
- manage reverse proxies and TLS
- inspect application and service logs
- operate Docker-based infrastructure

## Release discipline

Because the daemon performs compatibility checks against the panel, upgrades should be handled deliberately. In practice, that means:

- update the panel with the matching release notes in mind
- keep node daemons close to the panel version
- avoid leaving some nodes on very old releases

If you want step-by-step setup help, continue to [Getting Started](/panel/getting-started/).
