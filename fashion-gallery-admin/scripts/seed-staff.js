import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDLXWM08oKwXJPMK18Tn8ay8BWofGl7T8k',
  authDomain: 'fashion-gallery-dev.firebaseapp.com',
  projectId: 'fashion-gallery-dev',
  storageBucket: 'fashion-gallery-dev.firebasestorage.app',
  messagingSenderId: '119515956707',
  appId: '1:119515956707:web:dfe82fa4be9c5774df4cd6',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const STAFF = [
  {
    id: 'WqO0cTDYVWMHrJh3PsZqB0LL6xj1',
    name: 'Senith Chanidu',
    email: 'senith@example.com',
    role: 'super_admin',
    phone: '071 234 5678',
    isActive: true,
    createdAt: new Date('2026-05-01T10:00:00Z').getTime(),
    lastLogin: Date.now(),
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC&backgroundColor=e11d48&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-2',
    name: 'Nimali Perera',
    email: 'nimali.perera@email.com',
    role: 'admin',
    phone: '077 123 4567',
    isActive: true,
    createdAt: new Date('2026-05-15T10:00:00Z').getTime(),
    lastLogin: Date.now() - 3600000,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NP&backgroundColor=7e22ce&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-3',
    name: 'Tharushi Silva',
    email: 'tharushi.s@email.com',
    role: 'staff',
    phone: '071 234 5676',
    isActive: true,
    createdAt: new Date('2026-05-20T10:00:00Z').getTime(),
    lastLogin: Date.now() - 7200000,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TS&backgroundColor=0ea5e9&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-4',
    name: 'Hasini Wijesinghe',
    email: 'hasini.w@email.com',
    role: 'staff',
    phone: '070 345 6789',
    isActive: true,
    createdAt: new Date('2026-05-22T10:00:00Z').getTime(),
    lastLogin: Date.now() - 86400000,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HW&backgroundColor=0ea5e9&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-5',
    name: 'Dilini Fernando',
    email: 'dilini.f@email.com',
    role: 'staff',
    phone: '077 456 7890',
    isActive: true,
    createdAt: new Date('2026-05-25T10:00:00Z').getTime(),
    lastLogin: Date.now() - 172800000,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DF&backgroundColor=0ea5e9&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-6',
    name: 'Sachini Jayawardena',
    email: 'sachini.j@email.com',
    role: 'staff',
    phone: '076 567 8901',
    isActive: true,
    createdAt: new Date('2026-05-28T10:00:00Z').getTime(),
    lastLogin: Date.now() - 259200000,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ&backgroundColor=0ea5e9&textColor=ffffff',
    permissions: {}
  },
  {
    id: 'staff-7',
    name: 'Oshadi Bandara',
    email: 'oshadi.b@email.com',
    role: 'staff',
    phone: '071 678 9012',
    isActive: false,
    createdAt: new Date('2026-06-10T10:00:00Z').getTime(),
    lastLogin: null,
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=OB&backgroundColor=64748b&textColor=ffffff',
    permissions: {}
  }
];

async function seed() {
  console.log('Seeding staff...');
  for (const staff of STAFF) {
    await setDoc(doc(db, 'staff', staff.id), staff);
    console.log(`Added ${staff.name}`);
  }
  console.log('Done!');
  process.exit(0);
}

seed();
