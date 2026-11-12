-- Run explicitly against the dedicated sandbox database. Contains no product/price assumptions.
BEGIN;
CREATE TABLE IF NOT EXISTS dyane_checkout_inventory (
  sku text PRIMARY KEY CHECK (sku ~ '^[a-z0-9-]{1,100}$'),
  label text NOT NULL,
  price_id text NOT NULL CHECK (price_id ~ '^price_'),
  available integer NOT NULL DEFAULT 0 CHECK (available >= 0),
  active boolean NOT NULL DEFAULT false
);
CREATE TABLE IF NOT EXISTS dyane_checkout_orders (
  id uuid PRIMARY KEY,
  sku text NOT NULL REFERENCES dyane_checkout_inventory(sku),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 5),
  locale text NOT NULL CHECK (locale IN ('fr', 'en')),
  price_id text NOT NULL,
  params jsonb NOT NULL,
  status text NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'pending', 'paid', 'expired', 'manual_review')),
  session_id text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS dyane_checkout_events (
  id text PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES dyane_checkout_orders(id),
  processed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS dyane_checkout_orders_status ON dyane_checkout_orders(status, created_at);
COMMIT;
