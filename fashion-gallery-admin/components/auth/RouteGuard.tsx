'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User is not signed in
        router.push('/login');
      } else {
        // User is signed in, check if they are staff
        try {
          const staffDoc = await getDoc(doc(db, 'staff', user.uid));
          if (!staffDoc.exists() || !staffDoc.data()?.isActive) {
            // Not a staff member or inactive
            await signOut(auth);
            router.push('/login?error=unauthorized');
            return;
          }
          setLoading(false);
        } catch (error) {
          console.error('Error verifying staff status', error);
          await signOut(auth);
          router.push('/login?error=unauthorized');
        }
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-soft-beige)' }}>
        <p style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-burgundy)', fontSize: '20px' }}>Loading Admin...</p>
      </div>
    );
  }

  return <>{children}</>;
}
