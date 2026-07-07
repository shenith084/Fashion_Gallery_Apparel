import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Panel | Fashion Gallery Apparel",
  description: "Secure admin portal for Fashion Gallery Apparel",
};

import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader color="var(--color-burgundy)" showSpinner={false} />
        {children}
      </body>
    </html>
  );
}
