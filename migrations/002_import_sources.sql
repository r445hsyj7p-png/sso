-- Add import metadata columns to sso_apps
ALTER TABLE sso_apps ADD COLUMN import_source TEXT DEFAULT 'manual';
ALTER TABLE sso_apps ADD COLUMN external_id TEXT;
ALTER TABLE sso_apps ADD COLUMN logo_url TEXT;

-- Import log table
CREATE TABLE IF NOT EXISTS sso_import_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT NOT NULL,
  started_at INTEGER NOT NULL DEFAULT (unixepoch()),
  finished_at INTEGER,
  apps_added INTEGER DEFAULT 0,
  apps_updated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running',
  error_message TEXT
);
