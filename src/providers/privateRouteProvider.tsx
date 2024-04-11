'use client';
import { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

import useUserStore from '@/store/userStore';

const allowURL = ['/', '/login', '/registration'];

export const PrivateRouterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLogin, setRedirectUrl } = useUserStore((store) => store);

  if (!(isLogin && Cookies.get('session_id')) && !allowURL.includes(pathname)) {
    setRedirectUrl(pathname);
    router.replace('/login');
  }

  return <>{children}</>;
};
