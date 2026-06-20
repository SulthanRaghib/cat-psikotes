import { config } from 'dotenv';
config();

import DB from '../src/lib/db';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check if admin exists
  const existing = await DB.admins.findByUsername(username);
  if (existing) {
    console.log(`Admin user '${username}' already exists.`);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await DB.admins.create(username, hash);
  
  console.log('Admin user created successfully in provider:', DB.name);
  console.log('Username:', username);
  console.log('Password:', password);
};

seedAdmin().catch(console.error);
