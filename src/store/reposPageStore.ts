import { createStore } from 'zustand/vanilla';

type ReposPageStates = {
  currentPage: number;
  pagesCount: number;
};

type ReposPageActions = {
  setCurrentPage: (page: number) => void;
  setPagesCount: (page: number) => void;
};

const initialState: ReposPageStates = {
  currentPage: 1,
  pagesCount: 1,
};

export type ReposPageStore = ReposPageStates & ReposPageActions;

const createReposPageStore = (initState: ReposPageStates = initialState) => {
  return createStore<ReposPageStore>()((set) => ({
    ...initState,
    setCurrentPage: (page: number) => set(() => ({ currentPage: page })),
    setPagesCount: (page: number) => set(() => ({ pagesCount: page })),
  }));
};

export default createReposPageStore;
