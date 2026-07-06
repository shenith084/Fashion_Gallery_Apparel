import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Read existing database
    let db: { users?: any[], orders?: any[] } = { users: [], orders: [] };
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(fileData);
    }

    if (!db.users) db.users = [];

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 });
    }

    // Create new user
    const newUser = {
      id: `USR-${Date.now()}`,
      name,
      email,
      password, // In a real app, this MUST be hashed with bcrypt! Storing in plain text for this local mock DB.
      phone: '',
      address: '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6B2335&textColor=ffffff`,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Save DB
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error('Error in register:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
