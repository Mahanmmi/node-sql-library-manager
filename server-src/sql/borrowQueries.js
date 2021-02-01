const registerCreateBorrowFunction = `
CREATE OR REPLACE FUNCTION create_borrow_function(
  in_borrow_end_date TIMESTAMPTZ,
  user_type user_mods,
  username text
) RETURNS UUID AS $create_borrow_function$
DECLARE
  id UUID;
  late_count INT;
  banned_until TIMESTAMPTZ;
BEGIN
    SELECT late_count = COUNT(*)
    FROM Borrows
    WHERE (
      borrow_start_date + INTERVAL '60 days' > now() AND
      received_date IS NOT NULL AND
      borrow_end_date < received_date
    );

    SELECT banned_until = received_date + INTERVAL '30 days'
    FROM Borrows
    WHERE (
      borrow_start_date + INTERVAL '30 days' > now() AND
      received_date IS NOT NULL AND
      borrow_end_date < received_date)
    ORDER BY received_date DESC
    LIMIT 1;

    IF late_count >= 4 AND banned_until < now() THEN
      RAISE EXCEPTION 'You cannot borrow any more your account is limited until %', banned_until;
    END IF;

    INSERT INTO Borrows(
      in_borrow_end_date,
      username
    ) VALUES (
      in_borrow_end_date,
      username
    ) RETURNING borrow_id into id;
    INSERT INTO ACTIONS(
      username,
      action_text
    ) VALUES (
      username,
      FORMAT('Created new borrow')
    );
    RETURN id;
END;
$create_borrow_function$ LANGUAGE plpgsql;
`.trim();

const addBorrowBookFunction = `
CREATE OR REPLACE FUNCTION add_borrow_Book_function(
  borrow_id UUID,
  bookid text,
  bookvolume text,
  user_type user_mods,
  in_username text
) RETURNS VOID AS $add_borrow_Book_function$
DECLARE
  userperm SMALLINT;
  book_rec RECORD;
  bookperm SMALLINT;
BEGIN
    userperm := 0;
    IF user_type = 'student' THEN
      userperm := 1;
    ELSIF user_type = 'professor' THEN
      userperm := 2;
    ELSIF user_type = 'librarian' THEN
      userperm := 3;
    ELSIF user_type = 'manager' THEN
      userperm := 4;
    END IF;
    SELECT in_edition_id, book_type, book_price
    INTO book_rec
    FROM Books NATURAL JOIN StorageBook
    WHERE is_available = 1 AND book_id = bookid AND book_volume = bookvolume
    LIMIT 1;

    IF book_rec IS NULL THEN  
      RAISE EXCEPTION 'Book % vol % is not available in storage', bookid, bookvolume;
    ELSE
      bookperm := 0;
      IF book_rec.book_type = 'coursebook' THEN
        bookperm := 1;
      ELSIF book_rec.book_type = 'reference' THEN
        bookperm := 2;
      END IF;
      IF userperm < bookperm THEN
        RAISE EXCEPTION 'Users with type % cannot borrow % books, You cant borrow book % vol %', user_type, book_rec.book_type, bookid, bookvolume;
      ELSE
        UPDATE Users
        SET user_balance = user_balance - (book_rec.book_price * 0.05)
        WHERE username = in_username;

        UPDATE StorageBook
        SET is_available = 0
        WHERE in_edition_id = book_rec.in_edition_id AND book_id = bookid AND book_volume = bookvolume;

        INSERT INTO BorrowBooks(
          borrow_id,
          book_id,
          book_volume,
          in_edition_id
        ) VALUES (
          borrow_id,
          bookid,
          bookvolume,
          book_rec.in_edition_id
        );

        INSERT INTO ACTIONS(
          username,
          action_text
        ) VALUES (
          in_username,
          FORMAT('Added %s vol %s with edition id %s to borrow %s', bookid, bookvolume, book_rec.in_edition_id, borrow_id)
        );
      END IF;
    END IF;

END;
$add_borrow_Book_function$ LANGUAGE plpgsql;
`.trim();

const createBorrow = `
SELECT create_borrow_function(
  $1, $2, $3
)
`.trim();

const addBorrowBook = `
SELECT add_borrow_Book_function(
  $1, $2, $3, $4, $5
);
`.trim();

async function registerBorrowFunctions(client) {
  await client.query(registerCreateBorrowFunction);
  await client.query(addBorrowBookFunction);
}

module.exports = {
  registerBorrowFunctions,
  createBorrow,
  addBorrowBook,
}