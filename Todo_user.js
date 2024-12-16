const { Pool } = require("pg");

// Database configuration
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "To Do List",
  password: "123456",
  port: 5432,
});

async function insertUsers() {
  const client = await pool.connect();
  try {
    console.time("Insert Users");

    await client.query(
      `INSERT INTO users (name, email) VALUES ('User2', 'user2@example.com')`
    );
    console.timeEnd("Insert Users");
  } finally {
    client.release(); // Close connection
  }
}

async function insertTodos(todoCount) {
  const client = await pool.connect();
  try {
    console.time("Insert Todos");
    let values = [];
    for (let i = 1; i <= todoCount; i++) {
      const userId = 55978280;
      values.push(`(${userId}, 'Todo ${i}')`);
      if (i % 10 === 0) {
        await client.query(
          `INSERT INTO todos (user_id, title) VALUES ${values.join(",")}`
        );
        values = [];
      }
    }
    console.timeEnd("Insert Todos");
  } finally {
    client.release();
  }
}

async function fetchTodos() {
  const client = await pool.connect();
  try {
    console.time("fetch Todos");
    await client.query(`SELECT * FROM todos where user_id = 55978279 LIMIT 10000000`);
    console.timeEnd("fetch Todos");
  } finally {
    client.release();
  }
}

(async function main() {
//   let todo10thousandCount = 10000; //  10k
//   let todo100thousandCount = 100000; //  100k
//   let todo1MillionCount = 1000000; //  1M
  let todos10MillionCount = 10000000; //  10M
//   let todo100MillionCount = 100000000; //  100M
//   await insertUsers();
  await insertTodos(10);
    //  await fetchTodos()
  pool.end(); // Close database connection
})();
