const registerCreateBookFunction = `
CREATE OR REPLACE FUNCTION create_book_function(
  book_id text,
  book_volume text,
  book_type book_types,
  book_title text,
  book_genre text,
  book_page_count SMALLINT,
  book_price INTEGER,
  publisher_name text,
  user_type user_mods,
  username text
) RETURNS VOID AS $create_book_function$
BEGIN
    IF user_type != 'librarian' AND user_type != 'manager' THEN
      RAISE EXCEPTION 'Invalid user type! only librarians and managers could create books you are: %', user_type;
    ELSE
      INSERT INTO Books(
        book_id,
        book_volume, 
        book_type,
        book_title,
        book_genre,
        book_page_count,
        book_price,
        publisher_name
      ) VALUES (
        book_id,
        book_volume, 
        book_type,
        book_title,
        book_genre,
        book_page_count,
        book_price,
        publisher_name
      );
      INSERT INTO ACTIONS(
        username,
        action_text,
        action_type
      ) VALUES (
        username,
        FORMAT('Created book %s vol %s', book_id, book_volume),
        'createbook'
      );
    END IF;
END;
$create_book_function$ LANGUAGE plpgsql;
`.trim();

const registerCreatePublisherFunction = `
CREATE OR REPLACE FUNCTION create_publisher_function(
  publisher_name text,
  publisher_address text,
  publisher_website text,
  user_type user_mods,
  username text
) RETURNS VOID AS $create_publisher_function$
BEGIN
    IF user_type != 'librarian' AND user_type != 'manager' THEN
      RAISE EXCEPTION 'Invalid user type! only librarians and managers could create publishers you are: %', user_type;
    ELSE
      INSERT INTO Publishers(
        publisher_name,
        publisher_address,
        publisher_website
      ) VALUES (
        publisher_name,
        publisher_address,
        publisher_website
      );
      INSERT INTO ACTIONS(
        username,
        action_text,
        action_type
      ) VALUES (
        username,
        FORMAT('Created publisher %s', publisher_name),
        'createpublisher'
      );
    END IF;
END;
$create_publisher_function$ LANGUAGE plpgsql;
`.trim();

const registerAddBookWriterFunction = `
CREATE OR REPLACE FUNCTION add_book_writer_function(
  book_id text,
  book_volume text,
  writer_name text,
  user_type user_mods,
  username text
) RETURNS VOID AS $add_book_writer_function$
BEGIN
    IF user_type != 'librarian' AND user_type != 'manager' THEN
      RAISE EXCEPTION 'Invalid user type! only librarians and managers could add writers you are: %', user_type;
    ELSE
      INSERT INTO BookWriters(
        book_id,
        book_volume,
        writer_name
      ) VALUES (
        book_id,
        book_volume,
        writer_name
      );
      INSERT INTO ACTIONS(
        username,
        action_text,
        action_type
      ) VALUES (
        username,
        FORMAT('Added writer %s to %s vol %s', writer_name, book_id, book_volume),
        'addbookwriter'
      );
    END IF;
END;
$add_book_writer_function$ LANGUAGE plpgsql;
`.trim();

const registerAddBookFunction = `
CREATE OR REPLACE FUNCTION add_book_function(
  book_id text,
  book_volume text,
  user_type user_mods,
  username text
) RETURNS VOID AS $add_book_function$
BEGIN
    IF user_type != 'librarian' AND user_type != 'manager' THEN
      RAISE EXCEPTION 'Invalid user type! only librarians and managers could add writers you are: %', user_type;
    ELSE
      INSERT INTO StorageBook(
        book_id,
        book_volume
      ) VALUES (
        book_id,
        book_volume
      );
      INSERT INTO ACTIONS(
        username,
        action_text,
        action_type
      ) VALUES (
        username,
        FORMAT('Added a %s vol %s book to storage', book_id, book_volume),
        'addbook'
      );
    END IF;
END;
$add_book_function$ LANGUAGE plpgsql;
`.trim();

const createBook = `
SELECT create_book_function(
  $1, $2, $3, $4, $5,
  $6, $7, $8, $9, $10
);
`.trim();

const createPublisher = `
SELECT create_publisher_function(
  $1, $2, $3, $4, $5
);
`.trim();

const addWriter = `
SELECT add_book_writer_function(
  $1, $2, $3, $4, $5
);
`.trim();

const addBook = `
SELECT add_book_function(
  $1, $2, $3, $4
);
`.trim();

const searchBook = `
SELECT *
FROM Books NATURAL JOIN BookWriters
WHERE (
  book_title LIKE $1 AND
  writer_name LIKE $2 AND
  book_volume LIKE $3 AND
  book_genre LIKE $4
) ORDER BY book_title;
`.trim();

async function registerBookFunctions(client) {
  await client.query(registerCreateBookFunction);
  await client.query(registerCreatePublisherFunction);
  await client.query(registerAddBookWriterFunction);
  await client.query(registerAddBookFunction);
}

module.exports = {
  registerBookFunctions,
  createBook,
  createPublisher,
  addWriter,
  addBook,
  searchBook,
};
