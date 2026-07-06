import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductClient from '@/components/storefront/ProductClient';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function getProducts(): Promise<any[]> {
  try {
    const q = query(collection(db, 'products'), where('status', '==', 'Active'));
    const querySnapshot = await getDocs(q);
    const products: any[] = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products.find((p) => p.slug === resolvedParams.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | Fashion Gallery Apparel`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const products = await getProducts();
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
