import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(fileData);
      
      const userOrders = db.orders?.filter((o: any) => o.email === email) || [];
      return NextResponse.json(userOrders);
    }
    
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    
    // Read existing database
    let db: { orders: any[] } = { orders: [] };
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(fileData);
    }

    // Format new order
    const newOrder = {
      id: `#MM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      ...orderData,
      status: 'Processing',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      isNew: true
    };

    // Add to DB
    db.orders.unshift(newOrder); // Add to beginning

    // Save DB
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ success: false, error: 'Failed to place order' }, { status: 500 });
  }
}
