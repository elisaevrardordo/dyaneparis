BEGIN;
-- Enforce new messages without rewriting or blocking status updates on historic notes.
CREATE OR REPLACE FUNCTION dyane_validate_gift_message() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF char_length(NEW.gift_message) > 300
    OR cardinality(string_to_array(NEW.gift_message, chr(10))) > 3
    OR replace(NEW.gift_message, chr(10), '') ~ '[[:cntrl:]]'
    OR NEW.gift_message ~ U&'[\202A-\202E\2066-\2069]' THEN
    RAISE EXCEPTION 'Gift message must contain at most 300 characters and 3 lines, without control characters' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS dyane_gift_message_limits ON dyane_checkout_orders;
CREATE TRIGGER dyane_gift_message_limits BEFORE INSERT OR UPDATE OF gift_message ON dyane_checkout_orders
FOR EACH ROW EXECUTE FUNCTION dyane_validate_gift_message();
COMMIT;
