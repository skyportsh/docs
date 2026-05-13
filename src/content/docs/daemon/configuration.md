---
title: Daemon Configuration
description: Understand skyportd configuration files, environment overrides, and TLS behavior.
---

## File layout

```text
/etc/skyportd/
├── config/
│   ├── default.toml    # default settings (shipped with skyportd)
│   └── local.toml      # written by skyportd during enrollment
├── volumes/            # server data volumes
└── skyportd            # the daemon binary
```

## Configuration files

`skyportd` loads configuration in order:

1. `config/default.toml` — default values
2. `config/local.toml` — overrides written during enrollment
3. Environment variables — highest priority overrides

In normal usage, you do **not** need to manually edit these files. The daemon writes `local.toml` during enrollment and updates it as needed.

## Sections

### `[daemon]`

| Key | Description | Default |
| --- | --- | --- |
| `name` | Display name | `skyportd` |
| `uuid` | Daemon UUID (set during enrollment) | `00000000-...` |
| `tick_interval` | Internal tick interval | `5s` |
| `shutdown_timeout` | Graceful shutdown timeout | `30s` |
| `allow_private_webhooks` | Allow workflow webhooks to target private/internal IPs | `false` |

### `[panel]`

Stores the panel URL and credentials after enrollment. Managed automatically.

### `[logging]`

| Key | Options | Default |
| --- | --- | --- |
| `level` | `debug`, `info`, `warn`, `error` | `info` |
| `format` | `pretty`, `json` | `pretty` |

Use `json` format for centralized logging systems.

### `[runtime]`

| Key | Description | Default |
| --- | --- | --- |
| `worker_threads` | Tokio worker threads (`0` = auto) | `0` |

### `[node]`

Node-specific settings received from the panel: hostname, ports, SSL mode, TLS paths. Written automatically during enrollment.

### Webhook SSRF protection

Workflow webhook actions are blocked from targeting private/internal IPs by default
(`allow_private_webhooks = false`). This prevents malicious workflows from accessing
internal services (metadata endpoints, Redis, internal APIs, etc.).

Set to `true` in your local config if you run a single-tenant setup and need webhooks
to reach local services:

```toml
# config/local.toml
[daemon]
allow_private_webhooks = true
```

## Environment variable overrides

Use the prefix `SKYPORT_DAEMON` with double underscores as separators:

```bash
export SKYPORT_DAEMON__PANEL__URL=https://panel.example.com
export SKYPORT_DAEMON__PANEL__CONFIGURATION_TOKEN=your-token
export SKYPORT_DAEMON__LOGGING__LEVEL=debug
```

## TLS behavior

When SSL is enabled for a node, the daemon checks default Let's Encrypt paths:

```text
/etc/letsencrypt/live/<fqdn>/fullchain.pem
/etc/letsencrypt/live/<fqdn>/privkey.pem
```

If those files exist, they are used automatically. If not, the daemon prompts for custom paths interactively.

## CLI flags

| Flag | Description |
| --- | --- |
| `--configure` | Clear enrollment and re-run the setup prompt |
| `--debug` | Enable verbose debug logging |
| `--help` | Show help |

## Reconfiguring

To re-enroll the daemon with a different panel or token:

```bash
cd /etc/skyportd
sudo systemctl stop skyportd
sudo ./skyportd --configure
```

This clears the stored credentials and restarts the interactive enrollment flow.
