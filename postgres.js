const { Pool } = require('pg');
const { parse } = require('pg-connection-string')

const config = parse('postgres://borgdgvuyheyvs:b652809a1d9d7668dabf0605e3dd6f600dda09b20b73955a70ba95ab5beafa0b@ec2-52-206-193-199.compute-1.amazonaws.com:5432/d8drtbbcondv11')

config.ssl = {
  rejectUnauthorized: false
}
const pool = new Pool(config)

module.exports = pool;