import { create } from 'zustand';

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

const useSystemsPageStore = create<SystemsPageStore>((set) => ({
  ...initialState,
  setCurrentPage: (page: number) => set(() => ({ currentPage: page })),
  setPagesCount: (page: number) => set(() => ({ pagesCount: page })),
}));

export default useSystemsPageStore;
