BEGIN;

ALTER TABLE dyane_checkout_order_items
  ADD COLUMN IF NOT EXISTS composition text
  CHECK (composition IS NULL OR (sku = 'teo-for-dyane' AND composition IN ('no1', 'no2')));

ALTER TABLE dyane_checkout_order_items DROP CONSTRAINT IF EXISTS dyane_personalization_valid;
ALTER TABLE dyane_checkout_order_items ADD CONSTRAINT dyane_personalization_valid CHECK (
  (sku='teo-for-dyane' AND personalization IS NULL AND composition IS NOT NULL AND line_key=sku || ':' || composition)
  OR (sku<>'teo-for-dyane' AND composition IS NULL AND (
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
  ))
);

COMMIT;
