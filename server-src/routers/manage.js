/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = new express.Router();

const adminQueries = require('../sql/adminQueries');
const { getPool } = require('../database');

const userAuth = require('../middlewares/userAuth');

router.get('/borrowedbookreport', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.query(adminQueries.getBorrowedBookReport, [
      req.query.page ? req.query.page : 0,
      req.user.user_type,
    ]);
    return res.send(result);
  } catch (err) {
    return res.status(400).send(`Get borrowed books report failed: ${err.message}`);
  }
});

router.delete('/user', userAuth, async (req, res) =>{
  const pool = await getPool();
  try {
    await pool.query(adminQueries.deleteUser, [
      req.body.username,
      req.user.user_type,
    ]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).send(`Delete user failed: ${err.message}`);
  }
});

router.get('/user', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.query(adminQueries.searchUsers, [
      req.query.username ? `%${req.query.username}%` : '%',
      req.query.lastName ? `%${req.query.lastName}%` : '%',
      req.query.page ? req.query.page : 0,
      req.user.user_type,
    ]);
    return res.send(result);
  } catch (err) {
    return res.status(400).send(`Search user failed: ${err.message}`);
  }
});

router.get('/late', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.query(adminQueries.getOverdueBooks, [
      req.user.user_type,
    ]);
    return res.send(result);
  } catch (err) {
    return res.status(400).send(`Get overdue books failed: ${err.message}`);
  }
});

module.exports = router;
