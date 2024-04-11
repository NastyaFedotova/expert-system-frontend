import { createContext, ReactNode, useContext, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

type SystemsPageStates = {
  currentPage: number;
  pagesCount: number;
};

type SystemsPageActions = {
  setCurrentPage: (page: number) => void;
  setPagesCount: (page: number) => void;
};

const initialState: SystemsPageStates = {
  currentPage: 1,
  pagesCount: 1,
};

export type SystemsPageStore = SystemsPageStates & SystemsPageActions;

const createSystemPageStore = (initState: SystemsPageStates = initialState) => {
  return createStore<SystemsPageStore>()((set) => ({
    ...initState,
    setCurrentPage: (page: number) => set(() => ({ currentPage: page })),
    setPagesCount: (page: number) => set(() => ({ pagesCount: page })),
  }));
};

const SystemsPageStoreContext = createContext<StoreApi<SystemsPageStore> | null>(null);

export const SystemsPageStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<SystemsPageStore>>();
  if (!storeRef.current) {
    storeRef.current = createSystemPageStore();
  }

  return <SystemsPageStoreContext.Provider value={storeRef.current}>{children}</SystemsPageStoreContext.Provider>;
};

export const useSystemsPageStore = <T,>(selector: (store: SystemsPageStore) => T): T => {
  const counterStoreContext = useContext(SystemsPageStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

export default useSystemsPageStore;
