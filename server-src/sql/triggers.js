const userInsertUpdateTrigger = `
CREATE OR REPLACE FUNCTION user_insert_update_function() RETURNS trigger AS $user_insert_update_function$
BEGIN
  IF length(NEW.username) < 6 OR NEW.username !~ '^[a-zA-Z0-9]*$' THEN
    RAISE EXCEPTION 'Invalid username: %', NEW.username 
    using hint = 'Username must be alphanumeric and bigger than 5 characters';
    RETURN OLD;
  END IF;
  IF length(NEW.password) < 8 OR NEW.password ~ '^[0-9]*$' OR NEW.password ~* '^[a-z]*$' THEN
    RAISE EXCEPTION 'Invalid password: %', NEW.password
    using hint = 'Password must contain letters and numbers and be bigger than 7 characters';
    RETURN OLD;
  END IF;
  IF TG_OP = 'INSERT' OR OLD.password != crypt(NEW.password, OLD.password) THEN
    NEW.password = crypt(NEW.password, gen_salt('bf'));
    END IF;
    RETURN NEW;
  END;
$user_insert_update_function$ LANGUAGE plpgsql;
CREATE TRIGGER user_insert_update_trigger BEFORE INSERT OR UPDATE ON Users
FOR EACH ROW
EXECUTE PROCEDURE user_insert_update_function();
`.trim();

const successfulBorrowMessageTrigger = `
CREATE OR REPLACE FUNCTION successful_borrow_message_function()
RETURNS trigger AS $successful_borrow_message_function$
DECLARE
brec RECORD;
BEGIN

  SELECT DISTINCT username, borrow_start_date
  INTO brec
  FROM Borrows NATURAL JOIN BorrowBooks
  WHERE borrow_id = NEW.borrow_id
  LIMIT 1;

  INSERT INTO Messages(message_text)
  VALUES (FORMAT('User %s borrowed book %s vol %s at %s', brec.username, NEW.book_id, new.book_volume, brec.borrow_start_date));

  RETURN NEW;
END;
$successful_borrow_message_function$ LANGUAGE plpgsql;
CREATE TRIGGER successful_borrow_message_trigger AFTER INSERT ON BorrowBooks
FOR EACH ROW
EXECUTE PROCEDURE successful_borrow_message_function();
`.trim();

const endBorrowMessageTrigger = `
CREATE OR REPLACE FUNCTION end_borrow_message_function()
RETURNS trigger AS $end_borrow_message_function$
DECLARE
brec RECORD;
BEGIN
  IF OLD.received_date IS NULL AND NEW.received_date IS NOT NULL THEN
    IF NEW.received_date > NEW.borrow_end_date THEN
      INSERT INTO Messages(message_text)
      VALUES (FORMAT('User %s retuned borrow %s LATE', NEW.username, NEW.borrow_id));
    ELSE
      INSERT INTO Messages(message_text)
      VALUES (FORMAT('User %s retuned borrow %s', NEW.username, NEW.borrow_id));
    END IF;
  END IF;

  RETURN NEW;
END;
$end_borrow_message_function$ LANGUAGE plpgsql;
CREATE TRIGGER end_borrow_message_trigger AFTER Update ON Borrows
FOR EACH ROW
EXECUTE PROCEDURE end_borrow_message_function();
`.trim();

async function attachTriggers(client) {
  await client.query(userInsertUpdateTrigger);
  await client.query(successfulBorrowMessageTrigger);
  await client.query(endBorrowMessageTrigger);
}

module.exports = attachTriggers;
