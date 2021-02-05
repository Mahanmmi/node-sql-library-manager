const path = require('path');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const frontPath = path.join(__dirname, '../client-src/node-sql-library-manager-client/dist/');

app.use(express.static(frontPath));

app.get('/', function (req,res) {
  res.sendFile(frontPath + "index.html");
});

app.use('/api/users', require('./routers/user'));
app.use('/api/books', require('./routers/book'));
app.use('/api/borrows', require('./routers/borrow'));
app.use('/api/manage', require('./routers/manage'));

module.exports = app;
