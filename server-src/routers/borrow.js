/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = new express.Router();

const borrowQueries = require('../sql/borrowQueries');
const { getPool } = require('../database');

const userAuth = require('../middlewares/userAuth');

router.post('/', userAuth, async (req, res) => {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const borrowId = (await client.query(borrowQueries.createBorrow, [
      req.body.endDate,
      req.user.user_type,
      req.user.username,
    ])).rows[0].create_borrow_function;

    for (const book of req.body.books) {
      await client.query(borrowQueries.addBorrowBook, [
        borrowId,
        book.id,
        book.volume,
        req.user.user_type,
        req.user.username,
      ]);
    }
    await client.query('COMMIT');
    res.send(borrowId);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).send(`‌Borrow failed: ${err.message}`);
  } finally {
    client.release();
  }
});

router.post('/end', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(borrowQueries.endBorrow, [
      req.body.borrowId,
      req.user.username,
    ]);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(`‌Return borrow failed: ${err.message}`);
  }
});

module.exports = router;
