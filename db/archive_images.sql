CREATE TABLE IF NOT EXISTS archive_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL UNIQUE,
  filename TEXT,
  scene_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_archive_images_created_at
ON archive_images(created_at DESC);
