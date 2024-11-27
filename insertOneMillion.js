const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  user: 'postgres',      // Replace with your PostgreSQL username
  host: 'localhost',     // PostgreSQL host
  database: 'URL Shortner',  // Replace with your database name
  password: '123456',    // Replace with your password
  port: 5432,            // Default PostgreSQL port
});

// Function to generate random data
const generateData = (batchSize,startIndex) => {
  const rows = [];
  for (let i = startIndex; i < startIndex + batchSize; i++) {
    const originalUrl = `https://vishal.com/page/${i}`;
    const shortCode = `vishal${i}`;
    rows.push([originalUrl, shortCode]);
  }
  return rows;
};

// Insert rows into the table in batches
const insertData = async () => {
  const client = await pool.connect();

  try {
    // Start timing the insertion process
    const startTime = Date.now();
    
    // Begin the transaction
    await client.query('BEGIN');
    
    const batchSize = 1000;  // Insert in batches of 1000 rows
    const totalRows = 1000000;  // Total rows to insert
    const queryText = `
      INSERT INTO url_shortener (original_url, short_code) 
      VALUES ($1, $2)  
    `;

    // Insert rows in batches
    for (let i = 0; i < totalRows / batchSize; i++) {
      const startIndex = i*batchSize+1
      const rows = generateData(batchSize,startIndex);
      
      // Insert all rows of the current batch in one query
      const values = rows.map(row => `('${row[0]}', '${row[1]}')`).join(', '); // Join rows as a single string
      const batchQuery = `INSERT INTO url_shortener (original_url, short_code) VALUES ${values}`;
      
      // Execute the batch insert query
      await client.query(batchQuery);
    }

    // Commit the transaction
    await client.query('COMMIT');

    // End time and calculate elapsed time
    const endTime = Date.now();
    const elapsedTime = (endTime - startTime) / 1000; // time in seconds
    console.log(`1 million rows inserted in ${elapsedTime} seconds.`);
    
    // Query to find the table size after the insert
    const res = await client.query("SELECT pg_size_pretty(pg_total_relation_size('url_shortener')) AS table_size");
    console.log(`Table size after insertion: ${res.rows[0].table_size}`);
    
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
