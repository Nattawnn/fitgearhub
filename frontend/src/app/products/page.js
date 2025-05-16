'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to catalog page
    router.push('/catalog');
  }, [router]);

  return null; // or you could return a loading spinner
}
