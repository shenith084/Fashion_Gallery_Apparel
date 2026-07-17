import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: "Admin Panel | Fashion Gallery Apparel",
  description: "Internal dashboard for Fashion Gallery Apparel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`} suppressHydrationWarning>
        <NextTopLoader color="var(--color-burgundy)" showSpinner={false} />
        <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff', fontSize: '14px', borderRadius: '8px' } }} />
        {children}
      </body>
    </html>
  );
}
