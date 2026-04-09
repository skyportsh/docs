---
title: Installing skyportd
description: Install the Skyport daemon on a node and enroll it with the panel.
---

## Prerequisites

Before installing `skyportd`:

- The panel must be online
- You have created a **location** and **node** in the admin panel
- You have generated a **configuration token** for that node
- Docker is installed on the node machine

## Supported architectures

| Architecture | Binary |
| --- | --- |
| x86_64 | `skyportd-linux-x86_64` |
| aarch64 (ARM64) | `skyportd-linux-aarch64` |
| riscv64 | `skyportd-linux-riscv64` |

## Automatic installation (recommended)

The official installer handles everything — downloading the binary, setting up Docker, creating the systemd service, and optionally configuring the daemon:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-daemon.sh)
```

The installer will ask you to choose:

- **Release channel** — stable (downloads a pre-built binary) or bleeding edge (compiles from source)
- **Docker** — installs Docker if not already present
- **Panel URL and configuration token** — for immediate enrollment

After the installer finishes, `skyportd` is enrolled and running as a systemd service.

---

## Manual installation

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
```

### 2. Download the daemon binary

```bash
sudo mkdir -p /etc/skyportd/config /etc/skyportd/volumes

# For x86_64:
sudo curl -fsSL https://github.com/skyportsh/skyportd/releases/latest/download/skyportd-linux-x86_64 \
    -o /etc/skyportd/skyportd
sudo chmod +x /etc/skyportd/skyportd
```

For other architectures, replace the binary name accordingly.

If no stable release exists yet, clone and build from source:

```bash
sudo apt install -y build-essential pkg-config
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env
git clone --depth 1 https://github.com/skyportsh/skyportd.git /tmp/skyportd-build
cd /tmp/skyportd-build
cargo build --release
sudo cp target/release/skyportd /etc/skyportd/skyportd
sudo chmod +x /etc/skyportd/skyportd
```

### 3. Create the default config

Create `/etc/skyportd/config/default.toml`:

```toml
[daemon]
name = "skyportd"
uuid = "00000000-0000-0000-0000-000000000000"
tick_interval = "5s"
shutdown_timeout = "30s"

[panel]
url = "http://127.0.0.1:8000"
configuration_token = ""

[logging]
level = "info"
format = "pretty"

[runtime]
worker_threads = 0
```

### 4. Create a systemd service

Create `/etc/systemd/system/skyportd.service`:

```ini
[Unit]
Description=skyportd — Skyport Daemon
After=docker.service network.target
Wants=docker.service

[Service]
User=root
WorkingDirectory=/etc/skyportd
ExecStart=/etc/skyportd/skyportd
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable skyportd
```

### 5. Configure and enroll

You can configure the daemon in two ways:

**Option A: Interactive prompt**

```bash
cd /etc/skyportd
sudo ./skyportd
```

The daemon will prompt for the panel URL and configuration token on first run.

**Option B: Pre-configure**

Create `/etc/skyportd/config/local.toml`:

```toml
[panel]
url = "https://panel.example.com"
configuration_token = "your-one-time-token"
```

Then start the service:

```bash
sudo systemctl start skyportd
```

### 6. Verify enrollment

```bash
journalctl -u skyportd -f
```

You should see a successful enrollment message. The node will show as **online** in the panel.

## Reconfiguring

If you need to re-enroll the daemon (e.g., after moving to a new panel), use the `--configure` flag:

```bash
cd /etc/skyportd
sudo systemctl stop skyportd
sudo ./skyportd --configure
```

This clears the existing enrollment and restarts the interactive setup.
