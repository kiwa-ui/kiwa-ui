CREATE TABLE licenses (
  key TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  tier TEXT NOT NULL,
  lemon_order_id TEXT UNIQUE,
  lemon_variant_id TEXT,
  created_at INTEGER NOT NULL,
  revoked_at INTEGER
);

CREATE INDEX idx_licenses_email ON licenses(email);
CREATE INDEX idx_licenses_order ON licenses(lemon_order_id);
