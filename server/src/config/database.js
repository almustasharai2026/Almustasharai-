const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'legal_ai',
  user: 'postgres',
  password: 'postgres',
});

module.exports = pool;