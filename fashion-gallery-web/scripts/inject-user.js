const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'database.json');

try {
  let db = { users: [], orders: [] };
  
  if (fs.existsSync(DB_PATH)) {
    const fileData = fs.readFileSync(DB_PATH, 'utf-8');
    db = JSON.parse(fileData);
  }
  
  if (!db.users) db.users = [];
  
  const existingUser = db.users.find(u => u.email === 'shenith084@gmail.com');
  
  if (!existingUser) {
    db.users.push({
      id: `USR-${Date.now()}`,
      name: 'Shenith Chanidu',
      email: 'shenith084@gmail.com',
      password: 'password123',
      phone: '0705151000',
      address: 'No. 45, Lake Road, Moratuwa, Sri Lanka',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Shenith%20Chanidu&backgroundColor=6B2335&textColor=ffffff',
      createdAt: new Date().toISOString()
    });
    
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log('Successfully injected user shenith084@gmail.com with password123');
  } else {
    // Force update password just in case
    existingUser.password = 'password123';
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log('User already existed. Reset password to password123');
  }
} catch (e) {
  console.error('Error:', e);
}
