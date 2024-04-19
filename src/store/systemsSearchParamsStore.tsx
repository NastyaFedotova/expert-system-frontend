import { create } from 'zustand';

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

const useSystemsSearchParamsStore = create<SystemsSearchParamsStore>((set) => ({
  ...initialState,
  setSearchParamsPage: (params: SystemsSearchParamsStates) => set(params),
}));

// const SystemsSearchParamsStoreContext = createContext<StoreApi<SystemsSearchParamsStore> | null>(null);

// export const SystemsSearchParamsStoreProvider = ({ children }: { children: ReactNode }) => {
//   const storeRef = useRef<StoreApi<SystemsSearchParamsStore>>();
//   if (!storeRef.current) {
//     storeRef.current = createSystemsSearchParamsStore();
//   }

//   return (
//     <SystemsSearchParamsStoreContext.Provider value={storeRef.current}>
//       {children}
//     </SystemsSearchParamsStoreContext.Provider>
//   );
// };

// const useSystemsSearchParamsStore = <T,>(selector: (store: SystemsSearchParamsStore) => T): T => {
//   const counterStoreContext = useContext(SystemsSearchParamsStoreContext);

//   if (!counterStoreContext) {
//     throw new Error(`useCounterStore must be use within CounterStoreProvider`);
//   }

//   return useStore(counterStoreContext, selector);
// };

export default useSystemsSearchParamsStore;
