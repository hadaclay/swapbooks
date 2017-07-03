const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

// Connect to Database
// mongoose.connect(process.env.MONGO_URI);
// mongoose.Promise = global.Promise;
// mongoose.connection.on('error', (err) => {
//   console.error(`ERROR: ${err.message}`);
// });

// Models

// Start App
const app = require('./app');
app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
