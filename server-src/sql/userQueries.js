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

module.exports = {
  insertUser,
  insertPhoneNumber,
  insertAddress,
  insertNormalUser,
  insertStudentUser,
  insertProfessorUser,
  insertLibrarianUser,
  insertManagerUser,
  getUserByUsername,
  loginUser,
};
