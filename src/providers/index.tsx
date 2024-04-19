'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import useUserStore from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const { loginUserByCookie, setRouter } = useUserStore((store) => store);

  useEffect(() => {
    setRouter(router);
    loginUserByCookie();
  }, [loginUserByCookie, router, setRouter]);

  return (
    <ReactQueryProvider>
      <PrivateRouterProvider>{children}</PrivateRouterProvider>
    </ReactQueryProvider>
  );
};
