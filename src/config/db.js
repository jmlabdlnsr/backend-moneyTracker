const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = process.env.MYSQL_URL || {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_tracker_db',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
