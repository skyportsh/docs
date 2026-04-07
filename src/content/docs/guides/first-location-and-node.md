---
title: Creating Your First Location and Node
description: Set up the first region, node, configuration token, and allocations in Skyport.
---

Once the panel is online, the next job is to create somewhere for workloads to run.

## 1. Create a location

In the admin area, create a location for the region you want to represent.

Typical examples:

- Frankfurt
- Ashburn
- Los Angeles
- Singapore

A location in Skyport is just a grouping for one or more nodes.

## 2. Create a node

When creating the node, fill in:

- **Name** — internal label for the machine
- **Location** — the region you created above
- **FQDN** — the public hostname for the daemon
- **Daemon Port** — the API port the daemon will listen on
- **SFTP Port** — the SFTP port exposed for that node
- **Use SSL** — whether the daemon should serve TLS directly

## 3. Generate a configuration token

After the node exists, generate its one-time configuration token from the node management screen.

You will paste this into `skyportd` during first boot.

## 4. Install `skyportd` on the node machine

Follow [Installing skyportd](/daemon/installing/), using:

- the panel URL
- the node's configuration token

Once enrollment succeeds, the panel should begin recognizing the node as configured or online.

## 5. Add allocations

Next, create allocations for the node.

An allocation is a bind IP and port pair. For example:

- `0.0.0.0:25565`
- `0.0.0.0:25566`
- `0.0.0.0:27015`

These are the ports your future servers will actually claim.

## 6. Confirm connectivity

A healthy first node usually has all of the following true:

- the panel can load the node page without errors
- the daemon service is running under `systemd`
- `journalctl -u skyportd -f` shows successful enrollment and heartbeats
- firewall rules allow the configured daemon and SFTP ports
- Docker is installed and usable on the node host

## 7. Create your first server

Once allocations exist, you can create a server against:

- one user
- one node
- one allocation
- one cargo

If server creation fails, double-check that the node is enrolled and that the allocation belongs to that node.
