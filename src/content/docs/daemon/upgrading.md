---
title: Upgrading skyportd
description: Replace the daemon binary safely and restart the node service.
---

Keep `skyportd` close to your panel version. The daemon checks compatibility with the panel, so do not treat it as a completely independent component.

## 1. Back up local state

Before upgrading, back up:

- `/etc/skyportd/config/`
- `/etc/skyportd/skyportd.db` if you keep the working directory there
- your service unit if you customized it

## 2. Stop the service

```bash
sudo systemctl stop skyportd.service
```

## 3. Download the latest binary

```bash
sudo curl -fsSL https://github.com/skyportsh/skyportd/releases/latest/download/skyportd -o /usr/local/bin/skyportd
sudo chmod +x /usr/local/bin/skyportd
```

## 4. Start the service again

```bash
sudo systemctl start skyportd.service
```

## 5. Check logs

```bash
journalctl -u skyportd -n 100 --no-pager
```

If the daemon refuses to connect because of a compatibility check, update the panel to the matching release line first.

## Zero-drama upgrade checklist

- read the release notes
- upgrade the panel first if required
- update one node daemon and verify it
- roll out to the rest of your nodes
