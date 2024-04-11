'use client';
import { ReactNode } from 'react';

import { SystemsPageStoreProvider } from '@/store/systemsPageStore';
import { SystemsSearchParamsStoreProvider } from '@/store/systemsSearchParamsStore';
import { UserProvider } from '@/store/userStore';

import { PrivateRouterProvider } from './privateRouteProvider';
import { ReactQueryProvider } from './reactQuery';

export const Providers = ({ children }: { children: ReactNode }) => (
  <ReactQueryProvider>
    <SystemsPageStoreProvider>
      <SystemsSearchParamsStoreProvider>
        <UserProvider>
          <PrivateRouterProvider>{children} </PrivateRouterProvider>
        </UserProvider>
      </SystemsSearchParamsStoreProvider>
    </SystemsPageStoreProvider>
  </ReactQueryProvider>
);
