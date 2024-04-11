import { createContext, ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createStore, StoreApi } from 'zustand/vanilla';

type SystemsSearchParamsStates = {
  name?: string;
  username?: string;
};

type SystemsSearchParamsActions = {
  setSearchParamsPage: (params: SystemsSearchParamsStates) => void;
};

const initialState: SystemsSearchParamsStates = {
  name: undefined,
  username: undefined,
};

type SystemsSearchParamsStore = SystemsSearchParamsStates & SystemsSearchParamsActions;

const createSystemsSearchParamsStore = (initState: SystemsSearchParamsStates = initialState) => {
  return createStore<SystemsSearchParamsStore>()((set) => ({
    ...initState,
    setSearchParamsPage: (params: SystemsSearchParamsStates) => set(params),
  }));
};

const SystemsSearchParamsStoreContext = createContext<StoreApi<SystemsSearchParamsStore> | null>(null);

export const SystemsSearchParamsStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<SystemsSearchParamsStore>>();
  if (!storeRef.current) {
    storeRef.current = createSystemsSearchParamsStore();
  }

  return (
    <SystemsSearchParamsStoreContext.Provider value={storeRef.current}>
      {children}
    </SystemsSearchParamsStoreContext.Provider>
  );
};

const useSystemsSearchParamsStore = <T,>(selector: (store: SystemsSearchParamsStore) => T): T => {
  const counterStoreContext = useContext(SystemsSearchParamsStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

export default useSystemsSearchParamsStore;
