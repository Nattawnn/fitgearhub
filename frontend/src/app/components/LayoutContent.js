'use client';

import Header from './header';
import Footer from './footer';
import { usePathname } from 'next/navigation';

export default function LayoutContent({ children }) {
  const pathname = usePathname?.() || '';
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
} 