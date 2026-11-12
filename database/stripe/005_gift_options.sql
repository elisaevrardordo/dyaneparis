BEGIN;
ALTER TABLE dyane_checkout_orders ADD COLUMN IF NOT EXISTS gift_options jsonb NOT NULL DEFAULT '{"isGift":false}'::jsonb
  CHECK (gift_options IN ('{"isGift":false}'::jsonb, '{"isGift":true}'::jsonb));
-- Existing notes already express gift intent; keep all payment and stock data intact.
UPDATE dyane_checkout_orders SET gift_options='{"isGift":true}'::jsonb
WHERE gift_message <> '' AND gift_options='{"isGift":false}'::jsonb;
COMMIT;
