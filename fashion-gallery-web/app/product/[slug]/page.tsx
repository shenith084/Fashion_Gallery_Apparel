import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import ProductClient from '@/components/storefront/ProductClient';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

const getProductBySlug = cache(async (slug: string): Promise<any | null> => {
  try {
    const q = query(
      collection(db, 'products'),
      where('status', '==', 'Active'),
      where('slug', '==', slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
});

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  if (!product) return { title: 'Product Not Found' };

  const getImageUrl = (img: any): string => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    return img.secureUrl || img.url || '';
  };
  const ogImage = getImageUrl(product.images?.[0]) || 'https://fashiongalleryapparel.lk/logo.svg';

  return {
    title: `${product.name} | Fashion Gallery Apparel`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [ogImage],
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.map((img: any) => typeof img === 'string' ? img : (img.secureUrl || img.url || '')) || [],
    description: product.description,
    offers: {
      '@type': 'Offer',
      url: `https://fashiongalleryapparel.lk/product/${product.slug}`,
      priceCurrency: 'LKR',
      price: product.basePrice,
      availability: product.variants?.some((v: any) => v.stock > 0) 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    }
  };

  return (
    <>
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="container">
        <ProductClient product={product} />
      </main>
      <Footer />
    </>
  );
}
