'use client';
import React, { createContext, ReactNode, useContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';

import { createReposPageStore, ReposPageStore } from '@/store';

export const ReposPagerStoreContext = createContext<StoreApi<ReposPageStore> | null>(null);

export const ReposPageStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<ReposPageStore>>();
  if (!storeRef.current) {
    storeRef.current = createReposPageStore();
  }

  return <ReposPagerStoreContext.Provider value={storeRef.current}>{children}</ReposPagerStoreContext.Provider>;
};

export const useReposPageStore = <T,>(selector: (store: ReposPageStore) => T): T => {
  const counterStoreContext = useContext(ReposPagerStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
