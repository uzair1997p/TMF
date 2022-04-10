const mongoose = require('mongoose');

async function connect()
{
  const connectionString = process.env.MONGO_URI;
  if (true === process.env.MONGO_DEBUG) mongoose.set('debug', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(connectionString);
  return connectionString;
}
module.exports.connect = connect;
