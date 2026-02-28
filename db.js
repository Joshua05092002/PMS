const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'university_pms',
  password: '1234567890',
  port: 5432,
});

module.exports = pool;