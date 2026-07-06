import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const fileData = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(fileData);

    if (!db.users) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // STRICT CHECK: Verify email exists AND password matches exactly
    const user = db.users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });

  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
