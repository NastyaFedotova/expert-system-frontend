import { create } from 'zustand';

type SystemsSearchParamsStates = {
  currentPage: number;
  pagesCount: number;
  name?: string;
  username?: string;
};

type SystemsSearchParamsActions = {
  setCurrentPage: (currentPage: number) => void;
  setPagesCount: (pagesCount: number) => void;
  setSearchName: (name?: string) => void;
  setSearchUsername: (username?: string) => void;
  setSystemsSearchParams: (params: {
    currentPage?: number;
    pagesCount?: number;
    name?: string;
    username?: string;
  }) => void;
};

const initialState: SystemsSearchParamsStates = {
  name: undefined,
  username: undefined,
  currentPage: 1,
  pagesCount: 1,
};

type SystemsSearchParamsStore = SystemsSearchParamsStates & SystemsSearchParamsActions;

const useSystemsSearchParamsStore = create<SystemsSearchParamsStore>((set, get) => ({
  ...initialState,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setPagesCount: (pagesCount) => set({ pagesCount }),
  setSearchName: (name) => set({ name }),
  setSearchUsername: (username) => set({ username }),
  setSystemsSearchParams: (params) =>
    set({
      ...params,
      currentPage: params.currentPage ?? get().currentPage,
      pagesCount: params.pagesCount ?? get().pagesCount,
    }),
}));

export default useSystemsSearchParamsStore;
