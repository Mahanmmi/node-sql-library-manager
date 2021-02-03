/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const express = require('express');

const router = new express.Router();

const bookQueries = require('../sql/bookQueries');
const { getPool } = require('../database');

const userAuth = require('../middlewares/userAuth');

router.post('/', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(bookQueries.createBook, [
      req.body.bookId,
      req.body.bookVolume,
      req.body.bookType,
      req.body.bookTitle,
      req.body.bookGenre,
      req.body.bookPageCount,
      req.body.bookPrice,
      req.body.publisherName,
      req.user.user_type,
      req.user.username,
    ]);

    for (const writer of req.body.bookWriters) {
      await pool.query(bookQueries.addWriter, [
        req.body.bookId,
        req.body.bookVolume,
        writer,
        req.user.user_type,
        req.user.username,
      ]);
    }

    return res.sendStatus(201);
  } catch (err) {
    return res.status(400).send(`Book creation failed: ${err.message}`);
  }
});

router.post('/add', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(bookQueries.addBook, [
      req.body.bookId,
      req.body.bookVolume,
      req.user.user_type,
      req.user.username,
    ]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(400).send(`Book creation failed: ${err.message}`);
  }
});

router.get('/search', async (req, res) => {
  const pool = await getPool();
  try {
    const result = await pool.query(bookQueries.searchBook, [
      req.query.title ? `%${req.query.title}%` : '%',
      req.query.name ? `%${req.query.name}%` : '%',
      req.query.volume ? `%${req.query.volume}%` : '%',
      req.query.genre ? `%${req.query.genre}%` : '%',
    ]);
    return res.send(result);
  } catch (err) {
    return res.status(400).send(`Book search failed: ${err.message}`);
  }
});

router.post('/publisher', userAuth, async (req, res) => {
  const pool = await getPool();
  try {
    await pool.query(bookQueries.createPublisher, [
      req.body.publisherName,
      req.body.publisherAddress,
      req.body.publisherWebsite,
      req.user.user_type,
      req.user.username,
    ]);
    return res.sendStatus(201);
  } catch (err) {
    return res.status(400).send(`Book creation failed: ${err.message}`);
  }
});

module.exports = router;
