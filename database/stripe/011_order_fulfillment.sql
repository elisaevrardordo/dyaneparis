BEGIN;

ALTER TABLE dyane_checkout_inventory
  ADD COLUMN IF NOT EXISTS preorder_enabled boolean NOT NULL DEFAULT false
  CHECK (NOT preorder_enabled OR sku IN ('dyane-sculpture-25cl', 'dyane-no2-25cl'));

ALTER TABLE dyane_checkout_orders
  ADD COLUMN IF NOT EXISTS fulfillment text NOT NULL DEFAULT 'stock'
  CHECK (fulfillment IN ('stock', 'preorder'));

CREATE INDEX IF NOT EXISTS dyane_checkout_preorders_by_status
  ON dyane_checkout_orders(status, created_at) WHERE fulfillment = 'preorder';

COMMIT;
