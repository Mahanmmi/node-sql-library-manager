const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/user', require('./routers/user'));

module.exports = app;
