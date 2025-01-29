const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.DB_USER || "myuser" ,
  host: process.env.DB_HOST || "postgres",
  database: process.env.DB_NAME || "mydatabase",
  password: process.env.DB_PASS || "mypassword",
  port: process.env.DB_PORT || 5432,
});



// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend requests
app.use(express.json()); // Parse JSON request bodies

// Test route to check connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.send(`PostgreSQL connected: ${result.rows}`);
    console.log("Inside",result.rows)
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

// Route to execute queries
app.post('/api/query', async (req, res) => {
  const { sql } = req.body; // Get SQL query from the frontend
  try {
    console.log('Executing Query:', sql);
    const result = await pool.query(sql); // Execute SQL query
    res.status(200).json({ success: true, data: result.rows }); // Return results
  } catch (err) {
    console.error('Query Execution Error:', err.message);
    res.status(400).json({ success: false, error: err.message }); // Handle errors
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
