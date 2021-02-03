/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = new express.Router();

const adminQueries = require('../sql/adminQueries');
const { getPool } = require('../database');

const userAuth = require('../middlewares/userAuth');

router.get('/borrowedbookreport', async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.query(adminQueries.getBorrowedBookReport, [
      req.query.page ? req.query.page : 0,
    ]);
    return res.send(result);
  } catch (err) {
    return res.status(400).send(`Get borrowed books report failed: ${err.message}`);
  }
});

module.exports = router;
