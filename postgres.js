const Client = require('pg').Client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '1',
  port: 5433
});

module.exports = client;