const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/users', require('./routers/user'));
app.use('/api/books', require('./routers/book'));
app.use('/api/borrows', require('./routers/borrow'));

module.exports = app;
