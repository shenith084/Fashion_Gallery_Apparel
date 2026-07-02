// Shared static product data used across pages
// When Firebase is wired to the shop page, these will be replaced by Firestore queries

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  fabric: string;
  description: string;
  sizes: string[];
  colors: string[];
  modelSize: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'floral-maxi-dress',
    name: 'Floral Maxi Dress',
    slug: 'floral-maxi-dress',
    price: 4990,
    image: '/prod-floral-maxi.png',
    images: ['/prod-floral-maxi.png', '/prod-wrap-midi.png', '/prod-printed-long.png'],
    category: 'New Arrivals',
    categorySlug: 'new-arrivals',
    rating: 4,
    reviewCount: 128,
    isNew: true,
    isBestSeller: false,
    fabric: 'Cotton',
    description: 'A beautiful floral printed maxi dress perfect for any occasion. Features a flattering silhouette with vibrant patterns crafted from premium cotton for all-day comfort.',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    colors: ['Pink Floral', 'Blue Floral'],
    modelSize: 'Uk 10 (M)',
  },
  {
    id: 'wrap-midi-dress',
    name: 'Wrap Midi Dress',
    slug: 'wrap-midi-dress',
    price: 4490,
    image: '/prod-wrap-midi.png',
    images: ['/prod-wrap-midi.png', '/prod-floral-maxi.png'],
    category: 'New Arrivals',
    categorySlug: 'new-arrivals',
    rating: 4.5,
    reviewCount: 84,
    isNew: true,
    fabric: 'Linen',
    description: 'An elegant wrap midi dress with a flattering waist tie. Perfect for both casual and formal occasions. Breathable linen fabric keeps you cool and stylish.',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    colors: ['Dusty Rose', 'Sage Green', 'Cream'],
    modelSize: 'Uk 10 (M)',
  },
  {
    id: 'printed-long-dress',
    name: 'Printed Long Dress',
    slug: 'printed-long-dress',
    price: 4790,
    image: '/prod-printed-long.png',
    images: ['/prod-printed-long.png', '/prod-vneck.png'],
    category: 'Maxi Dresses',
    categorySlug: 'maxi-dresses',
    rating: 4,
    reviewCount: 87,
    isNew: true,
    fabric: 'Satin Blend',
    description: 'Bold abstract print long dress that makes a statement. Crafted from premium satin blend fabric with a flattering cut that flows beautifully.',
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: ['Black & White', 'Burgundy Print'],
    modelSize: 'Uk 10 (M)',
  },
  {
    id: 'vneck-midi-dress',
    name: 'V-Neck Midi Dress',
    slug: 'vneck-midi-dress',
    price: 4290,
    image: '/prod-vneck.png',
    images: ['/prod-vneck.png', '/prod-wrap-midi.png'],
    category: 'Midi Dresses',
    categorySlug: 'midi-dresses',
    rating: 4,
    reviewCount: 74,
    isNew: true,
    fabric: 'Cotton Blend',
    description: 'Elegant V-neck midi dress with a sophisticated silhouette. The deep V-neckline adds a touch of glamour while the midi length keeps it modest and chic.',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    colors: ['Burgundy', 'Navy', 'Black'],
    modelSize: 'Uk 10 (M)',
  },
  {
    id: 'shirt-dress',
    name: 'Shirt Dress',
    slug: 'shirt-dress',
    price: 4290,
    image: '/prod-shirt.png',
    images: ['/prod-shirt.png', '/prod-office.png'],
    category: 'Office Wear',
    categorySlug: 'office-wear',
    rating: 4,
    reviewCount: 51,
    isNew: true,
    fabric: 'Cotton',
    description: 'Classic shirt dress that transitions seamlessly from the office to evening. Tailored fit with button front and collar for a polished, professional look.',
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: ['White', 'Light Blue', 'Mint'],
    modelSize: 'Uk 10 (M)',
  },
  {
    id: 'office-wear-dress',
    name: 'Office Wear Dress',
    slug: 'office-wear-dress',
    price: 4290,
    image: '/prod-office.png',
    images: ['/prod-office.png', '/prod-shirt.png', '/prod-vneck.png'],
    category: 'Office Wear',
    categorySlug: 'office-wear',
    rating: 4,
    reviewCount: 63,
    isNew: false,
    isBestSeller: true,
    fabric: 'Cotton Blend',
    description: 'Sophisticated office dress designed for the modern professional woman. Elegant cut with comfortable fabric ensures you look and feel confident all day long.',
    sizes: ['M', 'L', 'XL', '2XL', '3XL'],
    colors: ['Burgundy', 'Navy', 'Black', 'Charcoal'],
    modelSize: 'Uk 10 (M)',
  },
];

export const CATEGORIES_LIST = [
  { label: 'All', slug: 'all' },
  { label: 'New Arrivals', slug: 'new-arrivals' },
  { label: 'Maxi Dresses', slug: 'maxi-dresses' },
  { label: 'Midi Dresses', slug: 'midi-dresses' },
  { label: 'Office Wear', slug: 'office-wear' },
  { label: 'Best Sellers', slug: 'best-sellers' },
];

export const SIZES_LIST = ['M', 'L', 'XL', '2XL', '3XL'];
