const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routers/user'));
app.use('/api/books', require('./routers/book'));
app.use('/api/borrows', require('./routers/borrow'));
app.use('/api/manage', require('./routers/manage'));

module.exports = app;
