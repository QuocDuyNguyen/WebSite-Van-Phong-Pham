import { getPool } from './server/config/db';

async function test() {
  const db = await getPool();
  try {
    const [rows] = await db.query('SELECT * FROM users LIMIT 1');
    console.log('Users table exists:', rows);
  } catch (error) {
    console.error('Database error:', error);
  }
  process.exit();
}

test();
