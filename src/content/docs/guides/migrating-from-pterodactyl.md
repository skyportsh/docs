---
title: Migrating from Pterodactyl
description: Import your users, nodes, eggs, allocations, and servers from a Pterodactyl panel into Skyport.
---

Skyport includes an automatic migration script that reads your Pterodactyl MySQL database and imports everything into a Skyport panel running on the same machine.

## What gets migrated

| Pterodactyl | → | Skyport | Notes |
| --- | --- | --- | --- |
| Users | → | Users | Passwords preserved (bcrypt hashes) — users can log in immediately |
| Locations | → | Locations | Country extracted from "City, CC" format |
| Nodes | → | Nodes | FQDN, ports, and SSL settings mapped |
| Nests + Eggs | → | Cargo | Nests are flattened — each egg becomes a cargo |
| Allocations | → | Allocations | All bind IPs, ports, and aliases |
| Servers | → | Servers | Imported as offline — need skyportd enrollment to go online |

## What does NOT migrate

- **Server files and volumes** — you will need to copy these manually from Wings to skyportd (see below)
- **Schedules, backups, and databases** — these are not yet supported in Skyport
- **API keys and subusers** — Skyport has a different permission model
- **Mounts** — not yet supported

## Prerequisites

Before migrating:

1. **Install the Skyport panel** on the same machine as your Pterodactyl panel (or a machine that can access the Pterodactyl MySQL database)
2. The Pterodactyl panel should be at one of: `/var/www/pterodactyl`, `/var/www/pelican`, or `/var/www/panel`
3. The Pterodactyl MySQL database must be accessible

## Running the migration

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/migrate-panel.sh)
```

The script will:

1. Auto-detect your Pterodactyl installation
2. Read the database credentials from Pterodactyl's `.env`
3. Show a summary of what will be migrated
4. Ask for confirmation before making any changes
5. Import all data into the Skyport database

## After migration

### 1. Enroll skyportd on each node

The migration imports node records, but the nodes need to be enrolled with skyportd. For each node:

1. Generate a configuration token in the Skyport admin panel
2. Install and configure skyportd on the node machine:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/skyportsh/installer/main/install-daemon.sh)
```

### 2. Migrate server volumes

Server files live on the node machines. To migrate them from Wings to skyportd:

```bash
# On each node, copy the server volumes
# Wings default: /var/lib/pterodactyl/volumes/<server-uuid>/
# skyportd default: /etc/skyportd/volumes/<server-id>/

# Example for a server with ID 1:
cp -a /var/lib/pterodactyl/volumes/<pterodactyl-server-uuid>/ /etc/skyportd/volumes/1/
chown -R root:root /etc/skyportd/volumes/1/
```

You can find the Pterodactyl server UUID in the old panel's database or admin area.

### 3. Verify user access

Users can log in with their existing Pterodactyl passwords — the bcrypt hashes are preserved during migration. Admin users retain their admin status.

### 4. Switch DNS

Once everything is verified, point your domain from the old Pterodactyl panel to the new Skyport panel.

## Running migration on a different machine

If Skyport is installed on a different machine than Pterodactyl, you can still migrate by making the Pterodactyl MySQL database accessible remotely. The migration script reads the database credentials from Pterodactyl's `.env` file, so you would need to:

1. Install Skyport on the new machine
2. Copy Pterodactyl's `.env` to a temporary location on the new machine (or create a dummy `/var/www/pterodactyl/.env` with the correct `DB_*` values pointing to the remote MySQL)
3. Run the migration script

## Troubleshooting

### "No Pterodactyl installation found"

The script looks for an `artisan` file and `.env` at `/var/www/pterodactyl`, `/var/www/pelican`, and `/var/www/panel`. If your installation is elsewhere, create a symlink:

```bash
ln -s /your/actual/path /var/www/pterodactyl
```

### "Cannot connect to Pterodactyl database"

Verify the database credentials in Pterodactyl's `.env` are correct and that MySQL is running.

### Servers show as "offline"

This is expected. Servers are imported as offline because they need skyportd enrollment before they can be managed. Follow the "Enroll skyportd" steps above.

### Duplicate FQDN warning

If multiple Pterodactyl nodes share the same FQDN (e.g., different ports on the same host), Skyport appends the daemon port to make each FQDN unique.
