-- LIS Clothing Swap — Initial Schema
-- Run this in the Supabase SQL Editor (or via supabase db push)

-- ─── Extensions ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE catalog_items (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  category    TEXT        NOT NULL,
  item_name   TEXT        NOT NULL,
  gender      TEXT        NOT NULL CHECK (gender IN ('boys', 'girls', 'unisex')),
  size        TEXT        NOT NULL,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category, item_name, gender, size)
);

CREATE TABLE inventory (
  id               UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  catalog_item_id  UUID        NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  quantity         INTEGER     NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (catalog_item_id)
);

CREATE TABLE transactions (
  id               UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  catalog_item_id  UUID        NOT NULL REFERENCES catalog_items(id) ON DELETE CASCADE,
  staff_email      TEXT        NOT NULL,
  quantity_delta   INTEGER     NOT NULL,
  transaction_type TEXT        NOT NULL CHECK (transaction_type IN ('donation', 'taken')),
  note             TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Auto-update trigger for inventory.updated_at ─────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Public convenience view ───────────────────────────────────────────────────

CREATE VIEW public_inventory AS
SELECT
  i.id,
  i.catalog_item_id,
  ci.category,
  ci.item_name,
  ci.gender,
  ci.size,
  ci.is_active,
  i.quantity
FROM inventory i
JOIN catalog_items ci ON ci.id = i.catalog_item_id
WHERE ci.is_active = true;

-- ─── Atomic stock functions ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_stock(catalog_item_id UUID, delta INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET quantity   = quantity + delta,
      updated_at = NOW()
  WHERE inventory.catalog_item_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_stock(catalog_item_id UUID, delta INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE inventory
  SET quantity   = GREATEST(0, quantity - delta),
      updated_at = NOW()
  WHERE inventory.catalog_item_id = $1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Row-Level Security ────────────────────────────────────────────────────────

ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions  ENABLE ROW LEVEL SECURITY;

-- Public (anon) can read catalog & inventory (powers the public browsing page)
CREATE POLICY "anon_read_catalog"
  ON catalog_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_read_inventory"
  ON inventory FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated staff can mutate catalog_items
CREATE POLICY "staff_insert_catalog"
  ON catalog_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "staff_update_catalog"
  ON catalog_items FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated staff can mutate inventory
CREATE POLICY "staff_insert_inventory"
  ON inventory FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "staff_update_inventory"
  ON inventory FOR UPDATE
  TO authenticated
  USING (true);

-- Transactions: staff can insert and read
CREATE POLICY "staff_insert_transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "staff_read_transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);
