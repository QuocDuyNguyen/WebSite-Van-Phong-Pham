import { getPool } from './server/config/db';
import bcrypt from 'bcryptjs';

async function setup() {
  const db = await getPool();
  try {
    // Demote all admins to user
    await db.query(`UPDATE users SET role = 'user' WHERE role = 'admin'`);
    console.log('Demoted old admins.');

    // Check if SA exists
    const [existing]: any = await db.query(`SELECT id FROM users WHERE email = 'SA'`);
    if (existing.length > 0) {
      await db.query(`UPDATE users SET role = 'admin' WHERE email = 'SA'`);
      console.log('SA account already exists, made it admin.');
    } else {
      const hash = await bcrypt.hash('123', 10);
      await db.query(`
        INSERT INTO users (full_name, email, password_hash, role) 
        VALUES ('System Admin', 'SA', ?, 'admin')
      `, [hash]);
      console.log('Created SA account.');
    }
  } catch (error) {
    console.error('Setup error:', error);
  }
  process.exit();
}

setup();
