const createPublishers = `
CREATE TABLE IF NOT EXISTS Publishers (
  publisher_name text NOT NULL PRIMARY KEY,
  publisher_address text NOT NULL,
  publisher_website text NOT NULL
);
`.trim();

const createBooks = `
CREATE TYPE book_types AS ENUM ('normal', 'coursebook', 'reference');
CREATE TABLE IF NOT EXISTS Books (
  book_id text,
  book_volume text,
  book_type book_types NOT NULL,
  book_title text NOT NULL,
  book_genre text NOT NULL,
  book_page_count SMALLINT NOT NULL,
  book_price INTEGER NOT NULL,
  publisher_name text NOT NULL,
  PRIMARY KEY (book_id, book_volume),
  FOREIGN KEY (publisher_name) REFERENCES Publishers(publisher_name) ON DELETE CASCADE
);
`.trim();

const createBookWriters = `
CREATE TABLE IF NOT EXISTS BookWriters (
  book_id text,
  book_volume text,
  writer_name text,
  PRIMARY KEY (book_id, book_volume, writer_name),
  FOREIGN KEY (book_id, book_volume) REFERENCES Books(book_id, book_volume) ON DELETE CASCADE
);
`.trim();

const createStorageBooks = `
CREATE TABLE IF NOT EXISTS StorageBook (
  book_id text,
  book_volume text,
  in_edition_id UUID DEFAULT uuid_generate_v4(),
  is_available SMALLINT DEFAULT 1,
  PRIMARY KEY (book_id, book_volume, in_edition_id),
  FOREIGN KEY (book_id, book_volume) REFERENCES Books(book_id, book_volume) ON DELETE CASCADE
);
`.trim();

const createUsers = `
CREATE TYPE user_mods AS ENUM ('normal', 'student', 'professor', 'librarian', 'manager');
CREATE TABLE IF NOT EXISTS Users (
  username citext PRIMARY KEY,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  user_type user_mods NOT NULL,
  user_balance INTEGER DEFAULT 0 CHECK (user_balance >= 0),
  created_on TIMESTAMPTZ DEFAULT now()
);
`.trim();

const createUserTokens = `
CREATE TABLE IF NOT EXISTS UserTokens (
  username citext,
  token text UNIQUE,
  PRIMARY KEY (username, token),
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createUserPhoneNumbers = `
CREATE TABLE IF NOT EXISTS UserPhoneNumbers (
  username citext,
  phone_number text,
  PRIMARY KEY (username, phone_number),
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createUserAddresses = `
CREATE TABLE IF NOT EXISTS UserAddresses (
  username citext,
  address text,
  PRIMARY KEY (username, address),
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createNormalUsers = `
CREATE TABLE IF NOT EXISTS NormalUsers (
  username citext PRIMARY KEY,
  normal_user_job text NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createStudentUsers = `
CREATE TABLE IF NOT EXISTS StudentUsers (
  username citext PRIMARY KEY,
  student_number text NOT NULL,
  student_university text NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createProfessorUsers = `
CREATE TABLE IF NOT EXISTS ProfessorUsers (
  username citext PRIMARY KEY,
  professor_id text NOT NULL,
  professor_university text NOT NULL,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createLibrarianUsers = `
CREATE TABLE IF NOT EXISTS LibrarianUsers (
  username citext PRIMARY KEY,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createManagerUsers = `
CREATE TABLE IF NOT EXISTS ManagerUsers (
  username citext PRIMARY KEY,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createBorrows = `
CREATE TABLE IF NOT EXISTS Borrows (
  borrow_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  borrow_start_date TIMESTAMPTZ DEFAULT now(),
  borrow_end_date TIMESTAMPTZ NOT NULL,
  username citext,
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

const createBorrowBooks = `
CREATE TABLE IF NOT EXISTS BorrowBooks (
  borrow_id UUID DEFAULT uuid_generate_v4(),
  book_id text,
  book_volume text,
  in_edition_id UUID,
  received_date TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (borrow_id, book_id, book_volume, in_edition_id),
  FOREIGN KEY (borrow_id) REFERENCES Borrows(borrow_id) ON DELETE CASCADE,
  FOREIGN KEY (book_id, book_volume, in_edition_id) REFERENCES StorageBook(book_id, book_volume, in_edition_id) ON DELETE CASCADE
);
`.trim();

const createMessages = `
CREATE TABLE IF NOT EXISTS Messages (
  message_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_text text
);
`.trim();

const createActions = `
CREATE TABLE IF NOT EXISTS Actions (
  action_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username citext NOT NULL,
  action_text text NOT NULL,
  action_time TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY (username) REFERENCES Users(username) ON DELETE CASCADE
);
`.trim();

async function createTables(client) {
  await client.query(createPublishers);
  await client.query(createBooks);
  await client.query(createBookWriters);
  await client.query(createStorageBooks);
  await client.query(createUsers);
  await client.query(createUserTokens);
  await client.query(createUserPhoneNumbers);
  await client.query(createUserAddresses);
  await client.query(createNormalUsers);
  await client.query(createStudentUsers);
  await client.query(createProfessorUsers);
  await client.query(createLibrarianUsers);
  await client.query(createManagerUsers);
  await client.query(createBorrows);
  await client.query(createBorrowBooks);
  await client.query(createMessages);
  await client.query(createActions);
}

module.exports = createTables;
