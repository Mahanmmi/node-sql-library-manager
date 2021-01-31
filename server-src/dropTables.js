const { dropDB } = require('./database');

dropDB().then(() => {
  console.log('DB dropped successfully');
}).catch((err) => {
  console.log(`Drop db failed: ${err.message}`);
});
