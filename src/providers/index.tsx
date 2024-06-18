'use client';
import { ReactNode } from 'react';

import Loader from '@/components/Loader';
import useSystemStore from '@/store/systemStore';
import useUserStore from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => {
  const isLogin = useUserStore((store) => store.isLogin);
  const isLoading = useSystemStore((store) => store.isLoading);

  return (
    <ReactQueryProvider>
      <PrivateRouterProvider>
        {isLogin === undefined || isLoading ? <Loader sizepx={116} /> : children}
      </PrivateRouterProvider>
    </ReactQueryProvider>
  );
};
