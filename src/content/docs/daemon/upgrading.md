---
title: Upgrading skyportd
description: Update the daemon binary and restart the service.
---

Keep `skyportd` close to your panel version. The daemon checks compatibility with the panel during enrollment and runtime, so mismatched versions may cause sync failures.

## 1. Back up local state

```bash
sudo cp -r /etc/skyportd/config /etc/skyportd/config.backup
```

## 2. Stop the service

```bash
sudo systemctl stop skyportd
```

## 3. Download the new binary

```bash
# For x86_64:
sudo curl -fsSL https://github.com/skyportsh/skyportd/releases/latest/download/skyportd-linux-x86_64 \
    -o /etc/skyportd/skyportd
sudo chmod +x /etc/skyportd/skyportd
```

For aarch64 or riscv64, replace the binary name accordingly.

## 4. Start the service

```bash
sudo systemctl start skyportd
```

## 5. Verify

```bash
journalctl -u skyportd -n 50 --no-pager
```

If the daemon refuses to connect due to a version mismatch, update the panel first.

## Upgrade checklist

1. Read the release notes
2. Upgrade the panel first if required
3. Update one node and verify it
4. Roll out to remaining nodes
