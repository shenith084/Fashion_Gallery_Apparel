import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

export async function GET() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      const db = JSON.parse(fileData);
      return NextResponse.json(db.returns || []);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error reading returns:', error);
    return NextResponse.json({ error: 'Failed to fetch returns' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, isNew } = await request.json();
    
    if (fs.existsSync(DB_PATH)) {
      const fileData = fs.readFileSync(DB_PATH, 'utf-8');
      let db = JSON.parse(fileData);
      
      if (!db.returns) db.returns = [];
      
      const returnIndex = db.returns.findIndex((r: any) => r.id === id);
      if (returnIndex !== -1) {
        if (status !== undefined) db.returns[returnIndex].status = status;
        if (isNew !== undefined) db.returns[returnIndex].isNew = isNew;
        
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        return NextResponse.json({ success: true, returnData: db.returns[returnIndex] });
      }
    }
    
    return NextResponse.json({ success: false, error: 'Return not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating return:', error);
    return NextResponse.json({ success: false, error: 'Failed to update return' }, { status: 500 });
  }
}
