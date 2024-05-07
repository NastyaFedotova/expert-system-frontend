import { create } from 'zustand';

type SystemsSearchParamsStates = {
  currentPage: number;
  pagesCount: number;
  name?: string;
  username?: string;
};

type SystemsSearchParamsActions = {
  setSearchParamsPage: (params: {
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

const useSystemsSearchParamsStore = create<SystemsSearchParamsStore>((set) => ({
  ...initialState,
  setSearchParamsPage: (params) => set({ ...params }),
}));

export default useSystemsSearchParamsStore;
