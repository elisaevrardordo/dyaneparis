BEGIN;
ALTER TABLE dyane_checkout_orders ADD COLUMN IF NOT EXISTS gift_message text NOT NULL DEFAULT '' CHECK (length(gift_message) <= 500);
CREATE TABLE IF NOT EXISTS dyane_checkout_order_items (
  order_id uuid NOT NULL REFERENCES dyane_checkout_orders(id),
  sku text NOT NULL REFERENCES dyane_checkout_inventory(sku),
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 5),
  price_id text NOT NULL,
  PRIMARY KEY (order_id, sku)
);
-- Backfill orders made by the original single-item integration.
INSERT INTO dyane_checkout_order_items (order_id,sku,quantity,price_id)
SELECT id,sku,quantity,price_id FROM dyane_checkout_orders o
WHERE NOT EXISTS (SELECT 1 FROM dyane_checkout_order_items i WHERE i.order_id=o.id)
ON CONFLICT DO NOTHING;
COMMIT;
