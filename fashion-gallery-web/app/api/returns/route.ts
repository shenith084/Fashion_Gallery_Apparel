import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function POST(request: Request) {
  try {
    const returnData = await request.json();
    
    // Read existing database
    let db: { returns: any[], orders: any[] } = { returns: [], orders: [] };
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(fileData);
      if (!db.returns) db.returns = [];
    }

    // Format new return
    const newReturn = {
      id: `#RTN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...returnData,
      status: 'Requested',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      isNew: true
    };

    // Add to DB
    db.returns.unshift(newReturn);

    // Save DB
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, returnData: newReturn });
  } catch (error) {
    console.error('Error saving return:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit return' }, { status: 500 });
  }
}
