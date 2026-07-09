const fs = require('fs');
const path = require('path');

const files = [
  'app/shop/page.tsx',
  'app/office-wear/page.tsx',
  'app/new-arrivals/page.tsx',
  'app/dresses/page.tsx',
  'app/dresses/maxi/page.tsx',
  'app/dresses/midi/page.tsx',
  'app/best-sellers/page.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('import { Suspense }')) {
    content = content.replace(/import ShopClient/, 'import { Suspense } from \'react\';\nimport ShopClient');
  }
  content = content.replace(/(<ShopClient[^>]*\/>)/g, '<Suspense fallback={<div style={{textAlign:"center", padding: "4rem"}}>Loading...</div>}>\n          $1\n        </Suspense>');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
});
