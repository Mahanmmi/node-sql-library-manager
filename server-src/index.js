/* eslint-disable no-console */
const { initDB } = require('./database');
const app = require('./app');

initDB().then(() => {
  app.listen(3000, async () => {
    console.log('Server is running...');
  });
}).catch((err) => {
  console.log(`Database initilization timed out: ${err.message}`);
});
