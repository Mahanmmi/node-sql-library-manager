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
  tmp RECORD;
BEGIN
    
    late_count := (
      SELECT COUNT(*)
      FROM Borrows
      WHERE (
        borrow_start_date + INTERVAL '60 days' > now() AND
        received_date IS NOT NULL AND
        borrow_end_date < received_date
      )
    );
    
    banned_until := (
      SELECT (received_date + INTERVAL '30 days')
      FROM Borrows
      WHERE (
        borrow_start_date + INTERVAL '30 days' > now() AND
        received_date IS NOT NULL AND
        borrow_end_date < received_date)
      ORDER BY received_date DESC
      LIMIT 1
    );

    IF late_count >= 4 AND banned_until > now() THEN
      RAISE EXCEPTION 'You cannot borrow any more your account is limited until %', banned_until;
    END IF;

    INSERT INTO Borrows(
      borrow_end_date,
      username
    ) VALUES (
      in_borrow_end_date,
      username
    ) RETURNING borrow_id into id;

    INSERT INTO ACTIONS(
      username,
      action_text,
      action_type
    ) VALUES (
      username,
      FORMAT('Created new borrow'),
      'startborrow'
    );

    RETURN id;
END;
$create_borrow_function$ LANGUAGE plpgsql;
`.trim();

const registerAddBorrowBookFunction = `
CREATE OR REPLACE FUNCTION add_borrow_book_function(
  borrow_id UUID,
  bookid text,
  bookvolume text,
  user_type user_mods,
  in_username text
) RETURNS VOID AS $add_borrow_book_function$
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
          action_text,
          action_type
        ) VALUES (
          in_username,
          FORMAT('Added %s vol %s with edition id %s to borrow %s', bookid, bookvolume, book_rec.in_edition_id, borrow_id),
          'addborrowbook'
        );
      END IF;
    END IF;
END;
$add_borrow_book_function$ LANGUAGE plpgsql;
`.trim();

const registerEndBorrowFunction = `
CREATE OR REPLACE FUNCTION end_borrow_function(
  in_borrow_id UUID,
  in_username text
) RETURNS VOID AS $end_borrow_function$
DECLARE
brec RECORD;
BEGIN

  UPDATE Borrows
  SET received_date = now()
  WHERE borrow_id = in_borrow_id;

  SELECT received_date, borrow_end_date
  INTO brec
  FROM Borrows
  WHERE borrow_id = in_borrow_id;

  IF brec IS NULL THEN
    RAISE EXCEPTION 'Borrow not found';
  END IF;

  UPDATE StorageBook
  SET is_available = 1
  WHERE (book_id, book_volume, in_edition_id) in (
    SELECT book_id, book_volume, in_edition_id
    FROM StorageBook NATURAL JOIN BorrowBooks
    WHERE borrow_id = in_borrow_id
  );

  IF brec.received_date > brec.borrow_end_date THEN
    INSERT INTO ACTIONS(
      username,
      action_text,
      action_type
    ) VALUES (
      in_username,
      FORMAT('Returned borrow %s LATE', in_borrow_id),
      'endborrow'
    );
  ELSE
    INSERT INTO ACTIONS(
      username,
      action_text,
      action_type
    ) VALUES (
      in_username,
      FORMAT('Returned borrow %s', in_borrow_id),
      'endborrow'
    );
  END IF;
END;
$end_borrow_function$ LANGUAGE plpgsql;
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

const endBorrow = `
SELECT end_borrow_function (
  $1, $2
);
`.trim();

async function registerBorrowFunctions(client) {
  await client.query(registerCreateBorrowFunction);
  await client.query(registerAddBorrowBookFunction);
  await client.query(registerEndBorrowFunction);
}

module.exports = {
  registerBorrowFunctions,
  createBorrow,
  addBorrowBook,
  endBorrow,
}
