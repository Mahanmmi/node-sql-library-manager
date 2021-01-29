/* eslint-disable no-await-in-loop */
const { Client } = require('pg');

let client;

async function tryConnect() {
  let isConnected = false;
  while (!isConnected) {
    try {
      client = new Client({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
      });
      await client.connect();
      isConnected = true;
      module.exports = client;
    } catch (e) {
      await client.end();
      // console.error(e.message);
    }
  }
}

tryConnect();
