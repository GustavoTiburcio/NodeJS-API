const {Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '1',
  port: 5433
});

module.exports = pool;