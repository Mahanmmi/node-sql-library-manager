const registerGetBorrowedBooksFunction = `
CREATE OR REPLACE FUNCTION get_borrowed_book_function(
  in_page INT
) RETURNS TABLE (
  request_date TIMESTAMPTZ,
  request_book_id text,
  request_book_volume text
) AS $get_borrowed_book_function$
BEGIN
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

const getBorrowedBookReport = `
SELECT get_borrowed_book_function(
  $1
)
`.trim();

async function registerAdminFunctions(client) {
  await client.query(registerGetBorrowedBooksFunction);
}

module.exports = {
  registerAdminFunctions,
  getBorrowedBookReport,
};
