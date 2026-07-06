import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

function readDB() {
  if (fs.existsSync(DB_PATH)) {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  }
  return { products: [], orders: [], users: [] };
}

function writeDB(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json(db.products || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const db = readDB();
    if (!db.products) db.products = [];
    
    const newProduct = {
      ...product,
      id: product.id || `PROD-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    db.products.push(newProduct);
    writeDB(db);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    const { id, ...data } = updates;
    
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const db = readDB();
    const index = db.products.findIndex((p: any) => p.id === id);
    
    if (index === -1) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    
    db.products[index] = { ...db.products[index], ...data };
    writeDB(db);
    
    return NextResponse.json(db.products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 });

    const db = readDB();
    db.products = db.products.filter((p: any) => p.id !== id);
    writeDB(db);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
