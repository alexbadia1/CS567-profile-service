require('dotenv').config();

module.exports = {
  mongo_connection: process.env.MONGODB_CONNECTION_STRING,
};
