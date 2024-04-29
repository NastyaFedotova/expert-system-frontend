'use client';
import { ReactNode, useEffect, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useUserStore from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loginUserByCookie, setHooks } = useUserStore((store) => store);

  useEffect(() => {
    loginUserByCookie();
  }, [loginUserByCookie]);

  useLayoutEffect(() => {
    setHooks({ router, searchParams });
  }, [router, searchParams, setHooks]);

  return (
    <ReactQueryProvider>
      <PrivateRouterProvider>{children}</PrivateRouterProvider>
    </ReactQueryProvider>
  );
};
