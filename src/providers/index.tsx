'use client';
import { ReactNode } from 'react';

import { ReactQueryProvider } from './reactQuery';
import { ReposPageStoreProvider } from './storeProvider';

export const Providers = ({ children }: { children: ReactNode }) => (
  <ReactQueryProvider>
    <ReposPageStoreProvider>{children}</ReposPageStoreProvider>
  </ReactQueryProvider>
);
