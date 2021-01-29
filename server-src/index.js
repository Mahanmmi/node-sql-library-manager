/* eslint-disable no-console */
require('./database');

console.log('successfully connected to database');

const app = require('./app');

app.listen(3000, () => {
  console.log('Server is running');
});
