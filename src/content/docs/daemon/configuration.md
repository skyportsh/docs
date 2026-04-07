---
title: Additional Configuration
description: Understand skyportd configuration files, environment overrides, and TLS behavior.
---

`skyportd` uses TOML-based configuration files.

## File layout

A common layout is:

```text
/etc/skyportd/
├── config/
│   └── local.toml
└── skyportd.db
```

In normal usage, you do **not** need to manually create and fill out a config file before starting the daemon.

On first boot, `skyportd` asks for the panel URL and configuration token, then writes `config/local.toml` for you.

## `local.toml`

`local.toml` is the main daemon config file. It is written and updated by `skyportd` during enrollment and normal operation.

Most users should treat this file as daemon-managed state, not something they need to hand-edit often.

Important sections:

### `[daemon]`

- `name` — display name for the daemon process
- `uuid` — bootstrap UUID, later replaced with the panel-issued UUID
- `tick_interval` — heartbeat-style internal tick interval
- `shutdown_timeout` — graceful shutdown timeout

### `[panel]`

This section stores the panel URL and the credentials `skyportd` uses after enrollment.

### `[logging]`

- `level` — log level such as `info` or `debug`
- `format` — `pretty` or `json`

### `[runtime]`

- `worker_threads` — number of runtime worker threads; `0` lets Tokio choose

### `[node]`

This section contains the node settings the daemon should use, including hostname, ports, SSL mode, and optional TLS certificate paths.

## Environment variable overrides

`skyportd` also supports environment-variable based overrides using the prefix `SKYPORT_DAEMON`.

Examples:

```bash
export SKYPORT_DAEMON__PANEL__URL=https://panel.example.com
export SKYPORT_DAEMON__PANEL__CONFIGURATION_TOKEN=your-token-here
```

## TLS behavior

When `use_ssl = true`, the daemon expects certificate paths.

It first checks the default Let's Encrypt layout for the node FQDN:

```text
/etc/letsencrypt/live/<fqdn>/fullchain.pem
/etc/letsencrypt/live/<fqdn>/privkey.pem
```

If those files are missing, the daemon asks for the paths interactively and stores them in `config/local.toml`.

## Local state database

`skyportd` stores local runtime state in `skyportd.db`. Treat it as part of the daemon's working data and back it up before major upgrades.

## Logging recommendation

For local debugging, `pretty` logs are great. For centralized logging systems, switch to `json`.
