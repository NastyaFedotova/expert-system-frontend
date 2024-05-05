'use client';
import { ReactNode, useLayoutEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Loader from '@/components/Loader';
import useUserStore from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setHooks, isLogin } = useUserStore((store) => store);

  useLayoutEffect(() => {
    setHooks({ router, searchParams });
  }, [router, searchParams, setHooks]);

  return (
    <ReactQueryProvider>
      <PrivateRouterProvider>{isLogin === undefined ? <Loader sizepx={116} /> : children}</PrivateRouterProvider>
    </ReactQueryProvider>
  );
};
