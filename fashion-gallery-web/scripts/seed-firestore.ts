/**
 * FIRESTORE SEED SCRIPT
 * Fashion Gallery Apparel — My Moon Clothing
 *
 * Seeds: categories, default public settings, sample products
 *
 * Run ONCE to initialize the database:
 *   npx ts-node --project tsconfig.json scripts/seed-firestore.ts
 *
 * SAFE to re-run — uses setDoc with merge:true so it won't duplicate.
 * NEVER run against production without confirming.
 */

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  Timestamp,
} from 'firebase/firestore';

// ── Load env manually for script context ──────────────────────
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'fashion-gallery-dev.firebaseapp.com',
  projectId: 'fashion-gallery-dev',
  storageBucket: 'fashion-gallery-dev.firebasestorage.app',
  messagingSenderId: '119515956707',
  appId: '1:119515956707:web:dfe82fa4be9c5774df4cd6',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const now = Timestamp.now();

// ─── CATEGORIES ───────────────────────────────────────────────
const CATEGORIES = [
  { id: 'new-arrivals', name: 'New Arrivals', slug: 'new-arrivals', order: 1 },
  { id: 'maxi-dresses', name: 'Maxi Dresses', slug: 'maxi-dresses', order: 2 },
  { id: 'midi-dresses', name: 'Midi Dresses', slug: 'midi-dresses', order: 3 },
  { id: 'office-wear', name: 'Office Wear', slug: 'office-wear', order: 4 },
  { id: 'best-sellers', name: 'Best Sellers', slug: 'best-sellers', order: 5 },
  { id: 'wholesale', name: 'Wholesale', slug: 'wholesale', order: 6 },
];

// ─── PUBLIC SETTINGS ──────────────────────────────────────────
const PUBLIC_SETTINGS = {
  aboutText: 'Fashion Gallery Apparel (My Moon Clothing) is a Sri Lankan women\'s boutique based in Moratuwa, offering elegant dresses and office wear for confident women.',
  awardYear: '2024',
  followerCount: '9.4K+',
  deliveryFee: 0,
  whatsappNumber: '94764165908',
  facebookUrl: 'https://www.facebook.com/FashionGalleryApparel',
  instagramUrl: 'https://www.instagram.com/fashiongalleryapparel',
  tiktokUrl: 'https://www.tiktok.com/@fashiongalleryapparel',
  updatedAt: now,
};

// ─── SAMPLE PRODUCTS ──────────────────────────────────────────
const SAMPLE_PRODUCTS = [
  {
    id: 'floral-maxi-dress',
    name: 'Floral Maxi Dress',
    slug: 'floral-maxi-dress',
    categoryId: 'new-arrivals',
    description: 'A beautiful floral printed maxi dress perfect for any occasion. Features a flattering silhouette and vibrant patterns.',
    images: [],
    fabric: 'Cotton',
    modelSize: 'Uk 10 (M)',
    variants: [
      { size: 'M', color: 'Pink Floral', stock: 8, priceOverride: null },
      { size: 'L', color: 'Pink Floral', stock: 5, priceOverride: null },
      { size: 'XL', color: 'Pink Floral', stock: 4, priceOverride: null },
      { size: '2XL', color: 'Pink Floral', stock: 2, priceOverride: null },
    ],
    basePrice: 4990,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['floral', 'maxi', 'cotton'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'wrap-midi-dress',
    name: 'Wrap Midi Dress',
    slug: 'wrap-midi-dress',
    categoryId: 'new-arrivals',
    description: 'An elegant wrap midi dress with a flattering waist tie. Perfect for both casual and formal occasions.',
    images: [],
    fabric: 'Linen',
    modelSize: 'Uk 10 (M)',
    variants: [
      { size: 'M', color: 'Dusty Rose', stock: 6, priceOverride: null },
      { size: 'L', color: 'Dusty Rose', stock: 4, priceOverride: null },
      { size: 'XL', color: 'Dusty Rose', stock: 3, priceOverride: null },
      { size: '2XL', color: 'Dusty Rose', stock: 2, priceOverride: null },
      { size: '3XL', color: 'Dusty Rose', stock: 1, priceOverride: null },
    ],
    basePrice: 4490,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['wrap', 'midi', 'linen'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'printed-long-dress',
    name: 'Printed Long Dress',
    slug: 'printed-long-dress',
    categoryId: 'new-arrivals',
    description: 'Bold abstract print long dress that makes a statement. Crafted from premium fabric for all-day comfort.',
    images: [],
    fabric: 'Satin Blend',
    modelSize: 'Uk 10 (M)',
    variants: [
      { size: 'M', color: 'Black & White', stock: 7, priceOverride: null },
      { size: 'L', color: 'Black & White', stock: 5, priceOverride: null },
      { size: 'XL', color: 'Black & White', stock: 3, priceOverride: null },
      { size: '2XL', color: 'Black & White', stock: 2, priceOverride: null },
    ],
    basePrice: 4790,
    status: 'active',
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    tags: ['printed', 'long', 'abstract'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'office-wear-dress',
    name: 'Office Wear Dress',
    slug: 'office-wear-dress',
    categoryId: 'office-wear',
    description: 'Sophisticated office dress designed for the professional woman. Elegant cut with comfortable fabric.',
    images: [],
    fabric: 'Cotton Blend',
    modelSize: 'Uk 10 (M)',
    variants: [
      { size: 'M', color: 'Burgundy', stock: 5, priceOverride: null },
      { size: 'L', color: 'Burgundy', stock: 4, priceOverride: null },
      { size: 'XL', color: 'Burgundy', stock: 3, priceOverride: null },
      { size: '2XL', color: 'Burgundy', stock: 2, priceOverride: null },
      { size: '3XL', color: 'Burgundy', stock: 1, priceOverride: null },
    ],
    basePrice: 4290,
    status: 'active',
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: ['office', 'professional', 'burgundy'],
    createdAt: now,
    updatedAt: now,
  },
];

// ─── SEED FUNCTION ────────────────────────────────────────────
async function seed() {
  console.log('🌱 Starting Firestore seed...\n');

  // Seed Categories
  console.log('📁 Seeding categories...');
  for (const cat of CATEGORIES) {
    await setDoc(
      doc(db, 'categories', cat.id),
      { ...cat, createdAt: now },
      { merge: true }
    );
    console.log(`  ✓ ${cat.name}`);
  }

  // Seed Public Settings
  console.log('\n⚙️  Seeding public settings...');
  await setDoc(
    doc(db, 'settings', 'public'),
    PUBLIC_SETTINGS,
    { merge: true }
  );
  console.log('  ✓ settings/public');

  // Seed Sample Products
  console.log('\n👗 Seeding sample products...');
  for (const product of SAMPLE_PRODUCTS) {
    const { id, ...data } = product;
    await setDoc(
      doc(db, 'products', id),
      data,
      { merge: true }
    );
    console.log(`  ✓ ${product.name}`);
  }

  console.log('\n✅ Seed complete! Database is ready.');
  console.log('\nNext steps:');
  console.log('  1. Go to Firebase Console → Firestore to verify data');
  console.log('  2. Set up Firebase Auth (Email/Password)');
  console.log('  3. Create Admin account via Firebase Console → Authentication');
  console.log('  4. Set up Firestore Security Rules');
}

seed().catch(console.error);
