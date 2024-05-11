import { create } from 'zustand';

type LoaderStates = {
  isLoading: boolean;
};

type LoaderActions = {
  setLoader: (status: boolean) => void;
};

const initialState: LoaderStates = {
  isLoading: false,
};

export type LoaderStore = LoaderStates & LoaderActions;

const useLoaderStore = create<LoaderStore>((set) => ({
  ...initialState,
  setLoader: (status) => set({ isLoading: status }),
}));

export default useLoaderStore;
