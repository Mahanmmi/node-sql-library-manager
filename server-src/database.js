/* eslint-disable no-await-in-loop */
const { Pool } = require('pg');

const importExtensions = require('./sql/extensions');
const createTables = require('./sql/createTables');
const attachTriggers = require('./sql/triggers');

let mainPool;

async function getPool() {
  while (!mainPool) {
    try {
      mainPool = new Pool({
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
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
