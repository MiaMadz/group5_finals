const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'breweries_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000,
});

// Test connection on startup
pool.getConnection()
    .then(conn => {
        console.log('Database connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

module.exports = pool;