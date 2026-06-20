import db from '../src/lib/db';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  const username = 'admin';
  const password = 'admin123';
  
  // Check if admin exists
  const existing = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (existing) {
    console.log('Admin user already exists.');
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const stmt = db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
  stmt.run(username, hash);
  
  console.log('Admin user created:');
  console.log('Username:', username);
  console.log('Password:', password);
};

seedAdmin();
