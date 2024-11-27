const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'URL Shortner',
  password: '123456',
  port: 5432,
});

const runQueries = async () => {
  const client = await pool.connect();
  const startTime = Date.now();

  try {
    console.log('Starting query execution...');
    const queryText = `
      SELECT original_url
      FROM url_shortener
      WHERE short_code IN ('code999', 'vishal50000', 'backend799999');
    `;

    // Run 100 million queries
    for (let i = 0; i < 100000000; i++) {
      await client.query(queryText);
      if (i % 10000 === 0) {
        console.log(`${i} queries executed...`);
      }
    }

    const endTime = Date.now();
    console.log(`Completed 100M queries in ${(endTime - startTime) / 1000} seconds.`);
  } catch (err) {
    console.error('Error executing queries:', err);
  } finally {
    client.release();
    pool.end();
  }
};

runQueries();