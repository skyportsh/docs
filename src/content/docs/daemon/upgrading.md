---
title: Upgrading skyportd
description: Update the daemon binary and restart the service.
---

## Automatic update (recommended)

The fastest way to update is with the official update script:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/update-daemon.sh)
```

The script handles everything automatically:

1. Detects the current version and architecture
2. Backs up the current binary and config to `backups/`
3. Stops the skyportd service
4. Downloads the latest release binary (or builds from source if no release exists)
5. Starts the service and verifies it's running

After the update, it shows the previous and current version numbers.

---

## Manual update

Keep `skyportd` close to your panel version. The daemon checks compatibility with the panel during enrollment and runtime, so mismatched versions may cause sync failures.

### 1. Back up

```bash
cp /etc/skyportd/skyportd /etc/skyportd/skyportd.bak
cp -r /etc/skyportd/config /etc/skyportd/config.bak
```

### 2. Stop the service

```bash
systemctl stop skyportd
```

### 3. Download the new binary

```bash
# For x86_64:
curl -fsSL https://github.com/skyportsh/skyportd/releases/latest/download/skyportd-linux-x86_64 \
    -o /etc/skyportd/skyportd
chmod +x /etc/skyportd/skyportd
```

For aarch64 or riscv64, replace the binary name accordingly.

### 4. Start the service

```bash
systemctl start skyportd
```

### 5. Verify

```bash
journalctl -u skyportd -n 50 --no-pager
```

If the daemon refuses to connect due to a version mismatch, update the panel first.

## Upgrade checklist

1. Read the release notes
2. Upgrade the panel first if required
3. Update one node and verify it works
4. Roll out to remaining nodes
