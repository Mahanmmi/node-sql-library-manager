/* eslint-disable no-await-in-loop */
const { Pool } = require('pg');

const importExtensions = require('./sql/extensions');
const createTables = require('./sql/createTables');
const attachTriggers = require('./sql/triggers');
const { registerBookFunctions } = require('./sql/bookQueries');
const { registerBorrowFunctions } = require('./sql/borrowQueries');
const { registerUserFunctions } = require('./sql/userQueries');
const { registerAdminFunctions } = require('./sql/adminQueries');

let mainPool;

async function getPool() {
  while (!mainPool) {
    try {
      mainPool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
      });
      const client = await mainPool.connect();
      client.release();
    } catch (e) {
      await mainPool.end();
      mainPool = undefined;
      console.error(e.message);
    }
  }
  return mainPool;
}

async function initDB() {
  const pool = await getPool();
  const client = await pool.connect();
  await client.query('BEGIN');
  try {
    await importExtensions(client);
    await createTables(client);
    await attachTriggers(client);
    await registerUserFunctions(client);
    await registerBookFunctions(client);
    await registerBorrowFunctions(client);
    await registerAdminFunctions(client);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.log(`Database initilization failed: ${err.message}`);
  } finally {
    client.release();
  }
}

async function dropDB() {
  const pool = await getPool();
  await pool.query('DROP SCHEMA public cascade');
  await pool.query('CREATE SCHEMA public');
  await pool.end();
}

module.exports = { initDB, dropDB, getPool };
