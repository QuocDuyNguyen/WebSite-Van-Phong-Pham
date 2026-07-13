import { getPool } from './server/config/db';

async function migrate() {
  const db = await getPool();
  try {
    // Add role column if it doesn't exist
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user'
    `);
    console.log('Added role column to users table.');

    // Make the first user an admin
    await db.query(`UPDATE users SET role = 'admin' LIMIT 1`);
    console.log('Made the first user an admin.');
  } catch (error: any) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Role column already exists.');
    } else {
      console.error('Migration error:', error);
    }
  }
  process.exit();
}

migrate();
