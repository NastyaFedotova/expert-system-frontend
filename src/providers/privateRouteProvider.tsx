'use client';
import { ReactNode, useLayoutEffect } from 'react';
import Cookies from 'js-cookie';
import { redirect, usePathname } from 'next/navigation';

const allowURL = ['/', '/login', '/registration'];

export const PrivateRouterProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!Cookies.get('session_id') && !allowURL.includes(pathname)) {
      redirect(`/login?back_uri=${pathname}`);
    }
  }, [pathname]);

  return children;
};
