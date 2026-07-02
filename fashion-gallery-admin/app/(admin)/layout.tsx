import AdminLayout from '@/components/layout/AdminLayout';
import RouteGuard from '@/components/auth/RouteGuard';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <AdminLayout>{children}</AdminLayout>
    </RouteGuard>
  );
}
