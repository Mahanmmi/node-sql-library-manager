const {
  getNormalUserByAuth,
  getStudentUserByAuth,
  getProfessorUserByAuth,
  getLibrarianUserByAuth,
  getManagerUserByAuth,
  getUserPhoneNumbers,
  getUserAddresses,
} = require('../sql/userQueries');
const { getPool } = require('../database');

async function tryFind(pool, query, token, req) {
  const user = (await pool.query(query, [token])).rows[0];
  if (user) {
    req.user = user;
    req.user.phoneNumbers = (await pool.query(getUserPhoneNumbers, [user.username])).rows;
    req.user.addresses = (await pool.query(getUserAddresses, [user.username])).rows;
    return true;
  }
  return false;
}

async function userAuth(req, res, next) {
  const token = req.header('Authorization').substring(7);
  if (!token) {
    return res.status(401).send('Auth token missing');
  }

  const pool = await getPool();
  try {
    if (await tryFind(pool, getNormalUserByAuth, token, req)) return next();
    if (await tryFind(pool, getStudentUserByAuth, token, req)) return next();
    if (await tryFind(pool, getProfessorUserByAuth, token, req)) return next();
    if (await tryFind(pool, getLibrarianUserByAuth, token, req)) return next();
    if (await tryFind(pool, getManagerUserByAuth, token, req)) return next();
    return res.sendStatus(401);
  } catch (err) {
    return res.status(500).send(`User auth check failed: ${err.message}`);
  }
}

module.exports = userAuth;
