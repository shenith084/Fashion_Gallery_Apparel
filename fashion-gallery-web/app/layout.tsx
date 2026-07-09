import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://fashiongalleryapparel.lk'),
  title: "Fashion Gallery Apparel | My Moon Clothing — Women's Dresses Sri Lanka",
  description: "Discover elegant dresses, office wear, maxi dresses & new arrivals at Fashion Gallery Apparel (My Moon Clothing). Island-wide delivery across Sri Lanka. Cash on Delivery available.",
  keywords: "women's dress shop Sri Lanka, Fashion Gallery Apparel Moratuwa, My Moon Clothing, fashiongalleryapparel, mymoonclothing, StayTrendy, ootd, StyleGoals, fashionaddict, WardrobeUpgrade, SlayTheDay, dripcheck, fitoftheday, slayqueens, StreetStyleVibes, killerfits, shopthelook, ShopNow, addtocartt, DailySlay, dress, womenfashionwear, onlineshopping, luxurylifestyle, ceylonfashion",
  openGraph: {
    title: "Fashion Gallery Apparel | My Moon Clothing",
    description: "Elegant women's fashion — Moratuwa, Sri Lanka. Island-wide delivery.",
    url: 'https://fashiongalleryapparel.lk',
    siteName: 'Fashion Gallery Apparel',
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fashion Gallery Apparel | My Moon Clothing",
    description: "Elegant women's fashion — Moratuwa, Sri Lanka. Island-wide delivery.",
  }
};

import NextTopLoader from 'nextjs-toploader';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextTopLoader color="var(--color-burgundy)" showSpinner={false} />
        <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', fontSize: '14px', borderRadius: '8px' } }} />
        {children}
      </body>
    </html>
  );
}
