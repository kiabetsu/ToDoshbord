const { Pool, types } = require('pg');

types.setTypeParser(types.builtins.TEXT, (text) => text);
types.setTypeParser(types.builtins.VARCHAR, (text) => text);

const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'todo_base',
  client_encoding: 'UTF8',
});

async function test() {
  const { rows } = await pool.query('SELECT $1 AS text', ['Привет мир']);
  console.log(rows[0].text); // Должно вывести "Привет мир"
}

test().catch(console.error);

module.exports = pool;
