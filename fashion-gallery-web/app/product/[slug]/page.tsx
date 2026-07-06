import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductClient from '@/components/storefront/ProductClient';

const DB_PATH = path.join(process.cwd(), '..', 'database.json');

function getProducts(): any[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
      return db.products || [];
    }
  } catch {}
  return [];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const products = getProducts();
  const product = products.find((p) => p.slug === resolvedParams.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Fashion Gallery Apparel`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const products = getProducts();
  const product = products.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <ProductClient product={product} />
      </main>
      <Footer />
    </>
  );
}
