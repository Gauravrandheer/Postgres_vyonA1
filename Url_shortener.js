const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',         
  database: 'URL Shortner',  
  password: '123456',
  port: 5432,               
});

// Function to generate random data
const generateData = () => {
  const rows = [];
  for (let i = 1; i <= 1000; i++) {
    const originalUrl = `https://example.com/page/${i}`;
    const shortCode = `code${i}`;
    rows.push([originalUrl, shortCode]);
  }
  return rows;
};

// Insert rows into the table
const insertData = async () => {
  const rows = generateData();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const queryText = `
      INSERT INTO url_shortener (original_url, short_code) 
      VALUES ($1, $2)  
    `;

    // $1 and $2 are placeholder for rows value

    for (const row of rows) {
      await client.query(queryText, row);
    }

    await client.query('COMMIT');
    console.log('1000 rows inserted successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting rows:', error);
  } finally {
    client.release();
  }
};

// Run the script
insertData()
  .then(() => pool.end())
  .catch((err) => {
    console.error('Error:', err);
    pool.end();
  });
