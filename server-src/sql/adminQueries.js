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

async function registerAdminFunctions(client) {
  await client.query(registerGetBorrowedBooksFunction);
  await client.query(registerDeleteUserFunction);
}

module.exports = {
  registerAdminFunctions,
  getBorrowedBookReport,
  deleteUser,
};
