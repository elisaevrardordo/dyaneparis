BEGIN;
-- Retain all existing gold/black lines; red is available only for the two confirmed No.1 SKUs.
ALTER TABLE dyane_checkout_order_items DROP CONSTRAINT IF EXISTS dyane_personalization_valid;
ALTER TABLE dyane_checkout_order_items ADD CONSTRAINT dyane_personalization_valid CHECK (
  (personalization IS NULL AND line_key=sku)
  OR (personalization IS NOT NULL AND jsonb_typeof(personalization)='object'
    AND personalization ? 'initials' AND personalization ? 'finish'
    AND jsonb_typeof(personalization->'initials')='string' AND jsonb_typeof(personalization->'finish')='string'
    AND (personalization->>'initials') ~ '^[A-Z]{1,3}$'
    AND (personalization->>'finish' IN ('gold','black')
      OR (personalization->>'finish'='red' AND sku IN ('dyane-sculpture-25cl','dyane-sculpture-150cl'))
      OR (personalization->>'finish'='green' AND sku IN ('dyane-no2-25cl','dyane-no2-150cl')))
    AND personalization - 'initials' - 'finish' = '{}'::jsonb
    AND line_key=sku || ':' || (personalization->>'finish') || ':' || (personalization->>'initials'))
);
COMMIT;
