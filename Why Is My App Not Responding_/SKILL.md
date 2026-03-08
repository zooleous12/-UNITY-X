---
name: webdev-project-restore
description: Restore a Manus webdev project from an uploaded archive (zip) into a fresh sandbox. Use when a user says their app is not working, needs to be restored, or when starting a new session with an existing webdev project that was previously deployed. Covers archive extraction, code merging, database migration, asset management, and verification.
---

# Webdev Project Restore

Restore a previously deployed Manus webdev project from an uploaded archive into a fresh sandbox environment. Sandbox environments reset between sessions — code, database tables, and environment variables do not persist.

## When to Use

- User says their app "isn't doing anything" or "stopped working" after a session break
- User uploads a zip/archive containing a previous Manus webdev project
- User references a project that was "already deployed" but the sandbox is fresh
- User wants to continue working on a project from a prior session

## Restore Process

1. **Extract and identify** the project files from the archive
2. **Initialize** a fresh Manus webdev project with `webdev_init_project`
3. **Merge** the old code into the new scaffold (preserving `_core` framework files)
4. **Install** dependencies and handle missing packages
5. **Migrate** the database schema (create all tables)
6. **Upload** media assets to S3 and update references
7. **Verify** the app runs and all tests pass
8. **Checkpoint** and deliver

## Step 1: Extract and Identify

```bash
mkdir -p /home/ubuntu/extracted
cd /home/ubuntu/extracted && unzip -o /path/to/archive.zip
```

Look for the project directory — typically contains `package.json`, `drizzle/schema.ts`, `server/`, `client/`. There may be nested zips; extract the one with the full project code (usually the largest `.zip` with a project name).

Identify the project name from `package.json` → `name` field.

## Step 2: Initialize Fresh Project

Call `webdev_init_project` with the original project name. This creates a fresh scaffold with proper environment variables (DATABASE_URL, JWT_SECRET, OAuth config, etc.) that do not carry over between sessions.

## Step 3: Merge Code

Copy user code over the fresh scaffold, **preserving `_core` framework files**:

```bash
SRC="/home/ubuntu/extracted/<project-name>"
DEST="/home/ubuntu/<project-name>"

# Back up fresh _core files
cp -r "$DEST/server/_core" /tmp/_core_backup

# Copy user code
cp -r "$SRC/client/src/"* "$DEST/client/src/"
cp -r "$SRC/server/"* "$DEST/server/"
cp -r "$SRC/drizzle/"* "$DEST/drizzle/"
cp -r "$SRC/shared/"* "$DEST/shared/" 2>/dev/null
cp -r "$SRC/client/public/"* "$DEST/client/public/" 2>/dev/null

# Restore _core framework (critical — contains env wiring, OAuth, context)
cp -r /tmp/_core_backup/* "$DEST/server/_core/"
```

**Key rule:** Never overwrite `server/_core/` — it contains environment bindings, OAuth flow, and tRPC context wired to the current sandbox.

## Step 4: Install Dependencies

```bash
cd /home/ubuntu/<project-name> && pnpm install
```

Check for packages the user's code imports but the scaffold doesn't include. Install them:

```bash
pnpm add <missing-package>
```

For packages requiring API keys (like Stripe), make initialization **graceful** so the server doesn't crash without the key:

```ts
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
```

Restart the dev server after installing: `webdev_restart_server`.

## Step 5: Migrate Database

The fresh sandbox has an empty database. `pnpm db:push` may skip migrations if the journal thinks they ran already.

**Use the migration script generator:**

```bash
python3 /home/ubuntu/skills/webdev-project-restore/scripts/apply_migrations.py /home/ubuntu/<project-name>
cd /home/ubuntu/<project-name> && node apply-migrations.mjs
```

This extracts CREATE TABLE and ALTER TABLE statements from all migration `.sql` files and applies them with IF NOT EXISTS / error-tolerant logic.

**Verify:** `SHOW TABLES;` — compare against tables in `drizzle/schema.ts`.

Clean up: `rm apply-migrations.mjs`

## Step 6: Upload Media to S3

Local media in `client/public/` causes deployment timeouts. Upload to S3:

```bash
manus-upload-file file1.png file2.jpg file3.mp4
```

Update code references from local paths (`/image.png`) to CDN URLs. Check:

- `client/src/pages/*.tsx` — image src attributes
- `client/public/manifest.json` — icon/screenshot URLs
- `client/index.html` — apple-touch-icon, OG meta tags
- Any component referencing `/public/` assets

Move uploaded files out:

```bash
mkdir -p /home/ubuntu/webdev-static-assets
mv client/public/*.png client/public/*.jpg /home/ubuntu/webdev-static-assets/
```

## Step 7: Verify

Run tests: `pnpm test`

**Common test failures after restore:**

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Cannot read properties of undefined` on select | Column name changed between migrations | Update test to use current names from `drizzle/schema.ts` |
| Chained `.where().where()` wrong results | Drizzle doesn't AND multiple `.where()` | Use `and()`: `.where(and(eq(...), eq(...)))` |
| Race condition in timestamp tests | `beforeEach` cleanup collides with parallel tests | Use unique userId per test or isolate cleanup |
| `Module not found` | Package not in fresh scaffold | `pnpm add <pkg>` then `webdev_restart_server` |

Check browser preview and dev server logs for runtime errors.

## Step 8: Checkpoint and Deliver

```
webdev_save_checkpoint → "Restored from archive. N tables migrated. M tests passing."
```

Attach: `manus-webdev://<version_id>`
