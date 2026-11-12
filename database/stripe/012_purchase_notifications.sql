BEGIN;
CREATE TABLE IF NOT EXISTS dyane_checkout_purchase_emails (
  order_id uuid NOT NULL REFERENCES dyane_checkout_orders(id),
  purpose text NOT NULL CHECK (purpose IN ('customer', 'house')),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'accepted', 'review')),
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  first_attempt_at timestamptz,
  lease_until timestamptz,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  accepted_at timestamptz,
  provider_id text,
  review_reason text CHECK (review_reason IN ('recipient_unavailable', 'retry_window_elapsed', 'idempotency_conflict')),
  PRIMARY KEY (order_id, purpose),
  CHECK ((state = 'pending') = (payload IS NOT NULL)),
  CHECK ((state = 'accepted') = (accepted_at IS NOT NULL AND provider_id IS NOT NULL)),
  CHECK ((state = 'review') = (review_reason IS NOT NULL))
);
COMMIT;
