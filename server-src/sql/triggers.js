const userInsertUpdate = `
CREATE OR REPLACE FUNCTION user_insert_update_function() RETURNS trigger AS $$
    BEGIN
      IF length(NEW.username) < 6 OR NEW.username !~ '^[a-zA-Z0-9]*$' THEN
      raise exception 'Invalid username: %', NEW.username 
      using hint = 'Username must be alphanumeric and bigger than 5 characters';
      END IF;
      IF length(NEW.password) < 8 OR NEW.username ~ '^[0-9]*$' OR NEW.username ~ '^[a-zA-Z]*$' THEN
      raise exception 'Invalid password: %', NEW.password 
      using hint = 'Password must contain letters and numbers and be bigger than 7 characters';
      END IF;
      IF TG_OP = 'INSERT' OR OLD.password != NEW.password THEN
        NEW.password = crypt(NEW.password, gen_salt('bf'));
      END IF;
      RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS user_insert_update_trigger ON Users;
CREATE TRIGGER user_insert_update_trigger AFTER INSERT OR UPDATE ON Users
    EXECUTE PROCEDURE user_insert_update_function()
`.trim();

async function attachTriggers(client) {
  await client.query(userInsertUpdate);
}

module.exports = attachTriggers;
