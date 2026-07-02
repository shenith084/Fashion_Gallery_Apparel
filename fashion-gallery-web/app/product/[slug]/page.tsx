import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductClient from '@/components/storefront/ProductClient';
import { PRODUCTS } from '@/lib/data/products';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Fashion Gallery Apparel`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.slug === resolvedParams.slug);

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
