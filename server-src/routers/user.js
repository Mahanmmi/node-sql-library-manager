/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = new express.Router();

const userQueries = require('../sql/userQueries');
const { getPool } = require('../database');

const userAuth = require('../middlewares/userAuth');

router.post('/', async (req, res) => {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user = await client.query(userQueries.insertUser, [
      req.body.username,
      req.body.password,
      req.body.firstName,
      req.body.lastName,
      req.body.userType,
      req.body.userBalance,
    ]);

    if (req.body.phoneNumbers) {
      for (const pn of req.body.phoneNumbers) {
        await client.query(userQueries.insertPhoneNumber, [req.body.username, pn]);
      }
    }

    if (req.body.addresses) {
      for (const address of req.body.addresses) {
        await client.query(userQueries.insertAddress, [req.body.username, address]);
      }
    }

    switch (req.body.userType) {
      case 'normal':
        await client.query(userQueries.insertNormalUser,
          [req.body.username, req.body.normalUserJob]);
        break;
      case 'student':
        await client.query(userQueries.insertStudentUser,
          [req.body.username, req.body.studentNumber, req.body.studentUniversity]);
        break;
      case 'professor':
        await client.query(userQueries.insertProfessorUser,
          [req.body.username, req.body.professorId, req.body.professorUniversity]);
        break;
      case 'librarian':
        await client.query(userQueries.insertLibrarianUser, [req.body.username]);
        break;
      case 'manager':
        await client.query(userQueries.insertManagerUser, [req.body.username]);
        break;
      default:
        throw new Error('Invalid user type');
    }

    await client.query('COMMIT');

    res.status(201).send(user.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).send(`User creation failed: ${err.message}`);
  } finally {
    client.release();
  }
});

router.post('/login', async (req, res) => {
  const pool = await getPool();
  try {
    const loginRow = (await pool.query(userQueries.loginUser,
      [req.body.username, req.body.password])).rows[0];
    if (!loginRow) {
      return res.sendStatus(401);
    }
    return res.send(loginRow.token);
  } catch (err) {
    return res.status(500).send(`Login failed: ${err.message}`);
  }
});

router.get('/logout', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(userQueries.logoutUser, [req.user.username, req.user.token]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(`Logout failed: ${err.message}`);
  }
});

router.get('/me', userAuth, async (req, res) => {
  res.send(req.user);
});

router.post('/balance', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(userQueries.addBalance, [
      req.body.balance,
      req.user.username,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(`‌Add balance failed: ${err.message}`);
  }
});

module.exports = router;
