const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'To Do List',
  password: '123456',
  port: 5432,
});

async function insertUsers(count) {
    const client = await pool.connect(); 
    try {
      console.time('Insert Users'); 
      let values = [];
      for (let i = 1; i <= count; i++) {
        values.push(`('User100Million${i}', 'user100million${i}@example.com')`);
        if (i % 1000 === 0) { // Insert every 1000 users
          await client.query(`INSERT INTO users (name, email) VALUES ${values.join(',')}`);
          values = [];
        }
      }
      console.timeEnd('Insert Users'); 
    } finally {
      client.release(); // Close connection
    }
  }


  async function insertTodos(userCount, todoCount) {
    const client = await pool.connect();
    try {
      console.time('Insert Todos');
      let values = [];
      for (let i = 1; i <= todoCount; i++) {
        const userId = Math.ceil(Math.random() * userCount); 
        values.push(`(${userId}, 'Todo10millions ${i}')`);
    if (i % 1000 === 0) {
await client.query(`INSERT INTO todos (user_id, title) VALUES ${values.join(',')}`);
          values = [];
        }
      }
      console.timeEnd('Insert Todos');
    } finally {
      client.release();
    }
  }

  (async function main() {
    console.log('Starting bulk inserts...');
    // let users1MillionCount = 1000000 // Insert 1M users
    // let users10MillionCount = 10000000 // Insert 10M users
    let users100MillionCount = 100000000 // Insert 100M users
    let todos10MillionCount = 10000000 // Insert 10M users
    await insertUsers(users100MillionCount); 
    // await insertTodos(users100MillionCount+10000000, todos10MillionCount);
    console.log('Bulk inserts completed.');
    pool.end(); // Close database connection
  })();

