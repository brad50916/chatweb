require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
})

const checkDatabaseConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()')
    console.log('Database connected:', res.rows[0].now)
  } catch (err) {
    console.error('Database connection error:', err)
  }
}

// Call the function to check the connection
checkDatabaseConnection()

module.exports = pool