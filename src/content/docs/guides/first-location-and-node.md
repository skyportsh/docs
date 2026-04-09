---
title: Creating Your First Location and Node
description: Set up a region, node, and allocations so you can start creating servers.
---

Once the panel is online, you need to create infrastructure before any servers can be deployed.

## 1. Create a location

In the admin panel, go to **Locations** and create one for your region. Examples:

- Frankfurt
- Ashburn
- Singapore

A location is just a grouping label for one or more nodes.

## 2. Create a node

Go to **Nodes** and create a new node:

| Field | Description |
| --- | --- |
| **Name** | Internal label (e.g., "US East 01") |
| **Location** | The region you just created |
| **FQDN** | Public hostname for the daemon (e.g., `node1.example.com`) |
| **Daemon Port** | API port the daemon listens on (default: 2800) |
| **SFTP Port** | SFTP port for file access (default: 2022) |
| **SSL** | Whether the daemon should use TLS |

## 3. Generate a configuration token

After creating the node, click on it to open its detail page, then generate a **configuration token**. You will paste this into `skyportd` during setup.

## 4. Install skyportd on the node

On the node machine, run the daemon installer:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-daemon.sh)
```

When prompted, enter the panel URL and the configuration token you just generated.

For manual installation, see [Installing skyportd](/daemon/installing/).

## 5. Verify the node is online

After enrollment, the node should appear as **online** in the panel within a few seconds. If it stays offline:

- Check `journalctl -u skyportd -f` on the node
- Verify the FQDN resolves to the node's IP
- Ensure the daemon port is open in your firewall

## 6. Add allocations

Go to the node's detail page and switch to the **Allocations** tab. Create one or more allocations:

| Bind IP | Port | Description |
| --- | --- | --- |
| `0.0.0.0` | `25565` | Minecraft default |
| `0.0.0.0` | `25566` | Second server |
| `0.0.0.0` | `27015` | Source engine |

You can create single ports or port ranges.

## 7. Create your first server

Go to **Servers** and click **Create**. You need:

- A **user** (the server owner)
- A **node** (the one you just set up — must be online)
- An **allocation** (from the node)
- A **cargo** (the server type — e.g., Paper, Vanilla)
- Resource limits (memory, CPU, disk)

The panel will sync the server to the daemon, which creates the Docker container and runs the installation.

## Troubleshooting

- **"Node is not online"** when creating a server — the daemon isn't connected. Check `systemctl status skyportd`.
- **No allocations available** — you need to create allocations on the node first.
- **Server stuck on "Installing"** — check the daemon logs: `journalctl -u skyportd -f`
