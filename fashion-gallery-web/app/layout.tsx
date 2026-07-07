import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fashion Gallery Apparel | My Moon Clothing — Women's Dresses Sri Lanka",
  description: "Discover elegant dresses, office wear, maxi dresses & new arrivals at Fashion Gallery Apparel (My Moon Clothing). Island-wide delivery across Sri Lanka. Cash on Delivery available.",
  keywords: "women's dress shop Sri Lanka, Fashion Gallery Apparel Moratuwa, My Moon Clothing, maxi dresses, midi dresses, office wear Sri Lanka",
  openGraph: {
    title: "Fashion Gallery Apparel | My Moon Clothing",
    description: "Elegant women's fashion — Moratuwa, Sri Lanka. Island-wide delivery.",
    type: "website",
    locale: "en_US",
  },
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="var(--color-burgundy)" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
