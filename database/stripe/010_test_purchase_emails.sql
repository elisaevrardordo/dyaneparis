-- Sandbox delivery capture. No sender consumes this table.
BEGIN;
CREATE TABLE IF NOT EXISTS dyane_checkout_test_emails (
  order_id uuid PRIMARY KEY REFERENCES dyane_checkout_orders(id),
  recipient text NOT NULL,
  subject text NOT NULL,
  text_body text NOT NULL,
  html_body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
