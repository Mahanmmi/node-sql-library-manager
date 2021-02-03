const registerGetBorrowedBooksFunction = `
CREATE OR REPLACE FUNCTION get_borrowed_book_function(
  in_page INT,
  user_type user_mods
) RETURNS TABLE (
  request_date TIMESTAMPTZ,
  request_book_id text,
  request_book_volume text
) AS $get_borrowed_book_function$
BEGIN
IF user_type != 'manager' AND user_type != 'librarian' THEN
    RAISE EXCEPTION 'You dont have permission to delete a user';
END IF;
RETURN QUERY (
    SELECT 
      borrow_start_date AS request_date,
      book_id as request_book_id,
      book_volume as request_book_volume
    FROM BorrowBooks NATURAL JOIN Borrows
    ORDER BY borrow_start_date DESC
    LIMIT 5
    OFFSET 5*in_page
  );
END;
$get_borrowed_book_function$ LANGUAGE plpgsql;
`.trim();

const registerDeleteUserFunction = `
CREATE OR REPLACE FUNCTION delete_user_function(
  username_to_remove text,
  user_type user_mods
) RETURNS VOID AS $delete_user_function$
BEGIN
  IF user_type != 'manager' THEN
    RAISE EXCEPTION 'You dont have permission to delete a user';
  END IF;
  DELETE FROM Users
  WHERE username = username_to_remove;
END;
$delete_user_function$ LANGUAGE plpgsql;
`.trim();

const registerUserSearchFunction = `
CREATE OR REPLACE FUNCTION user_search_function(
  in_username text,
  in_lastname text,
  in_page INT,
  in_user_type user_mods
) RETURNS TABLE (
    user_name citext,
    password text,
    first_name text,
    lastname text,
    user_type user_mods,
    user_balance REAL,
    created_on TIMESTAMPTZ
) AS $user_search_function$
BEGIN
IF in_user_type != 'manager' AND in_user_type != 'librarian' THEN
    RAISE EXCEPTION 'You dont have permission to search users';
END IF;
RETURN QUERY (
    SELECT *
    FROM Users
    WHERE
      username like in_username AND
      last_name like in_lastname
    ORDER BY last_name
    LIMIT 5
    OFFSET 5*in_page
  );
END;
$user_search_function$ LANGUAGE plpgsql;
`.trim();

const registerGetOverdueBooksFunction = `
CREATE OR REPLACE FUNCTION get_overdue_books_function(
  in_user_type user_mods
) RETURNS TABLE (
    bookid text,
    bookvolume text,
    in_ed_id UUID,
    borrow_deadline TIMESTAMPTZ
) AS $get_overdue_books_function$
BEGIN
IF in_user_type != 'manager' AND in_user_type != 'librarian' THEN
    RAISE EXCEPTION 'You dont have permission to search users';
END IF;
RETURN QUERY (
    SELECT 
      book_id AS bookid,
      book_volume AS bookvolume,
      in_edition_id AS in_ed_id,
      borrow_end_date AS borrow_deadline
    FROM Borrows NATURAL JOIN BorrowBooks
    WHERE
      now() > borrow_end_date AND
      received_date IS NULL
    ORDER BY (now() - borrow_end_date) DESC
  );
END;
$get_overdue_books_function$ LANGUAGE plpgsql;
`.trim();

const registerGetBorrowHistoryFunction = `
CREATE OR REPLACE FUNCTION get_borrow_history_function(
  bookid text,
  bookvolume text,
  in_user_type user_mods
) RETURNS TABLE (
    user_name citext,
    in_ed_id UUID,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ
) AS $get_borrow_history_function$
BEGIN
IF in_user_type != 'manager' AND in_user_type != 'librarian' THEN
    RAISE EXCEPTION 'You dont have permission to search users';
END IF;
RETURN QUERY (
    SELECT 
      username,
      in_edition_id,
      borrow_start_date,
      received_date
    FROM Borrows NATURAL JOIN BorrowBooks
    WHERE
      book_id = bookid AND
      book_volume = bookvolume
    ORDER BY received_date DESC
  );
END;
$get_borrow_history_function$ LANGUAGE plpgsql;
`.trim();

const getBorrowedBookReport = `
SELECT get_borrowed_book_function(
  $1, $2
);
`.trim();

const deleteUser = `
SELECT delete_user_function(
  $1, $2
);
`.trim();

const searchUsers = `
SELECT user_search_function(
  $1, $2, $3, $4
);
`.trim();

const getOverdueBooks = `
SELECT get_overdue_books_function(
  $1
);
`.trim();

const getBorrowHistory = `
SELECT get_borrow_history_function(
  $1, $2, $3
)
`.trim();

async function registerAdminFunctions(client) {
  await client.query(registerGetBorrowedBooksFunction);
  await client.query(registerDeleteUserFunction);
  await client.query(registerUserSearchFunction);
  await client.query(registerGetOverdueBooksFunction);
  await client.query(registerGetBorrowHistoryFunction);
}

module.exports = {
  registerAdminFunctions,
  getBorrowedBookReport,
  deleteUser,
  searchUsers,
  getOverdueBooks,
  getBorrowHistory,
};
