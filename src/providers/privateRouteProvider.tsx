'use client';
import { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

const allowURL = ['/', '/login', '/registration'];

export const PrivateRouterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  if (!Cookies.get('session_id') && !allowURL.includes(pathname)) {
    router.replace(`/login?back_uri=${pathname}`);
  }

  return <>{children}</>;
};
