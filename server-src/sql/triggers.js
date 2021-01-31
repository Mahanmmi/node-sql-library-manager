const userInsertUpdate = `
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

async function attachTriggers(client) {
  await client.query(userInsertUpdate);
}

module.exports = attachTriggers;
