import * as fs from 'fs';
import * as path from 'path';
import { PRODUCTS } from '../lib/data/products';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

const migrate = () => {
  let db: any = { products: [] };
  
  if (fs.existsSync(DB_PATH)) {
    const fileData = fs.readFileSync(DB_PATH, 'utf-8');
    db = JSON.parse(fileData);
  }

  // Generate SKUs, Stock, Status
  const migratedProducts = PRODUCTS.map((p, index) => {
    const sku = `MM-${p.categorySlug.toUpperCase().substring(0, 4)}-00${index + 1}`;
    const stock = Math.floor(Math.random() * 30); // Random stock 0-30
    
    let status = 'Active';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 15) status = 'Low Stock';

    return {
      ...p,
      sku,
      stock,
      status
    };
  });

  db.products = migratedProducts;
  
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  console.log(`Successfully migrated ${migratedProducts.length} products to database.json`);
};

migrate();
