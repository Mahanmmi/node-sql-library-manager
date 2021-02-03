const registerAddBalanceFunction = `
CREATE OR REPLACE FUNCTION add_balance_function(
  in_balance REAL,
  in_username text
) RETURNS VOID AS $add_balance_function$
BEGIN
  IF in_balance <= 0 THEN
    RAISE EXCEPTION 'Added balance must be positive';
  END IF;

  UPDATE Users
  SET user_balance = user_balance + in_balance
  WHERE username = in_username;

  INSERT INTO ACTIONS(
    username,
    action_text,
    action_type
  ) VALUES (
    in_username,
    FORMAT('Added %s to their balance', in_balance),
    'addbalance'
  );
END;
$add_balance_function$ LANGUAGE plpgsql;
`.trim();

const insertUser = `
INSERT INTO Users(username, password, first_name, last_name, user_type, user_balance) VALUES(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
) RETURNING *;
`.trim();

const insertPhoneNumber = `
INSERT INTO UserPhoneNumbers(username, phone_number) VALUES(
  $1,
  $2
) RETURNING *;
`.trim();

const insertAddress = `
INSERT INTO UserAddresses(username, address) VALUES(
  $1,
  $2
) RETURNING *;
`.trim();

const insertNormalUser = `
INSERT INTO NormalUsers(username, normal_user_job) VALUES(
  $1,
  $2
) RETURNING *;
`.trim();

const insertStudentUser = `
INSERT INTO StudentUsers(username, student_number, student_university) VALUES(
  $1,
  $2,
  $3
) RETURNING *;
`.trim();

const insertProfessorUser = `
INSERT INTO ProfessorUsers(username, professor_id, professor_university) VALUES(
  $1,
  $2,
  $3
) RETURNING *;
`.trim();

const insertLibrarianUser = `
INSERT INTO LibrarianUsers(username) VALUES(
  $1
) RETURNING *;
`.trim();

const insertManagerUser = `
INSERT INTO ManagerUsers(username) VALUES(
  $1
) RETURNING *;
`.trim();

const getUserByUsername = `
SELECT *
FROM Users
WHERE username = $1;
`.trim();

const loginUser = `
INSERT INTO UserTokens(username, token)
SELECT $1::text, crypt($1::text, gen_salt('bf'))::text
WHERE EXISTS (
  SELECT *
  FROM Users
  WHERE username = $1 AND password = crypt($2, password)
) RETURNING *;
`.trim();

const logoutUser = `
DELETE FROM UserTokens
WHERE username = $1 AND token = $2;
`.trim();

const getNormalUserByAuth = `
SELECT *
FROM Users NATURAL JOIN UserTokens NATURAL JOIN UserPhoneNumbers NATURAL JOIN UserAddresses NATURAL JOIN NormalUsers
WHERE token = $1;
`.trim();
const getStudentUserByAuth = `
SELECT *
FROM Users NATURAL JOIN UserTokens NATURAL JOIN StudentUsers
WHERE token = $1;
`.trim();
const getProfessorUserByAuth = `
SELECT *
FROM Users NATURAL JOIN UserTokens NATURAL JOIN ProfessorUsers
WHERE token = $1;
`.trim();
const getLibrarianUserByAuth = `
SELECT *
FROM Users NATURAL JOIN UserTokens NATURAL JOIN LibrarianUsers
WHERE token = $1;
`.trim();
const getManagerUserByAuth = `
SELECT *
FROM Users NATURAL JOIN UserTokens NATURAL JOIN ManagerUsers
WHERE token = $1;
`.trim();

const getUserPhoneNumbers = `
SELECT phone_number
FROM UserPhoneNumbers
WHERE username = $1
`.trim();

const getUserAddresses = `
SELECT address
FROM UserAddresses
WHERE username = $1
`.trim();

const addBalance = `
SELECT add_balance_function(
  $1, $2
)
`.trim();

async function registerUserFunctions(client) {
  await client.query(registerAddBalanceFunction);
}

module.exports = {
  registerUserFunctions,
  insertUser,
  insertPhoneNumber,
  insertAddress,
  insertNormalUser,
  insertStudentUser,
  insertProfessorUser,
  insertLibrarianUser,
  insertManagerUser,
  loginUser,
  logoutUser,
  getNormalUserByAuth,
  getStudentUserByAuth,
  getProfessorUserByAuth,
  getLibrarianUserByAuth,
  getManagerUserByAuth,
  getUserPhoneNumbers,
  getUserAddresses,
  addBalance,
};
