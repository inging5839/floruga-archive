-- Remove unused action_name column from archive_images (Cloudflare D1 / SQLite 3.35+)
ALTER TABLE archive_images DROP COLUMN action_name;
