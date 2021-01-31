const uuidOssp = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
`.trim();

const citext = `
CREATE EXTENSION IF NOT EXISTS citext;
`.trim();

const pgcrypto = `
CREATE EXTENSION IF NOT EXISTS pgcrypto
`.trim();

async function importExtensions(client) {
  await client.query(uuidOssp);
  await client.query(citext);
  await client.query(pgcrypto);
}

module.exports = importExtensions;
