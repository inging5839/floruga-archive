-- Panel story text sent with archive images (Cloudflare D1 / SQLite 3.35+)
ALTER TABLE archive_images ADD COLUMN story_text TEXT;
