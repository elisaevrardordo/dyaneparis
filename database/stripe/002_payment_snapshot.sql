BEGIN;
ALTER TABLE dyane_checkout_orders ADD COLUMN IF NOT EXISTS payment_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
COMMIT;
