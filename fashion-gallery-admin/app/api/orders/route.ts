import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function GET() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(fileData);
      return NextResponse.json(db.orders);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error reading orders:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, isNew } = await request.json();
    
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      let db = JSON.parse(fileData);
      
      const orderIndex = db.orders.findIndex((o: any) => o.id === id);
      if (orderIndex !== -1) {
        if (status !== undefined) {
          db.orders[orderIndex].status = status;
          if (status === 'Delivered' && !db.orders[orderIndex].deliveryDate) {
            db.orders[orderIndex].deliveryDate = new Date().toISOString();
          }
        }
        if (isNew !== undefined) db.orders[orderIndex].isNew = isNew;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return NextResponse.json({ success: true, order: db.orders[orderIndex] });
      }
    }
    
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }
    
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      let db = JSON.parse(fileData);
      
      const initialLength = db.orders.length;
      db.orders = db.orders.filter((o: any) => o.id !== id);
      
      if (db.orders.length < initialLength) {
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete order' }, { status: 500 });
  }
}
