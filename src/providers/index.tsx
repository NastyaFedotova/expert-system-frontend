'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import useUserStore from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loginUserByCookie, setHooks } = useUserStore((store) => store);

  useEffect(() => {
    setHooks({ router, searchParams });
    loginUserByCookie();
  }, [loginUserByCookie, router, searchParams, setHooks]);

  return (
    <ReactQueryProvider>
      <PrivateRouterProvider>{children}</PrivateRouterProvider>
      {/* {children} */}
    </ReactQueryProvider>
  );
};
