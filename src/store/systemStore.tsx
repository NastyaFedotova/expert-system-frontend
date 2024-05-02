import { create } from 'zustand';

import { createSystem } from '@/api/services/systems';
import { TErrorResponse } from '@/types/error';
import { TSystem, TSystemNew } from '@/types/systems';
import { errorParser } from '@/utils';

type SystemStates = {
  fetchloading: boolean;
  fetchError?: TErrorResponse;
  system?: TSystem;
};

type SystemActions = {
  createSystem: (params: TSystemNew) => void;
  reset: () => void;
  clearFetchError: () => void;
};

const initialState: SystemStates = {
  fetchloading: false,
  fetchError: undefined,
};

export type SystemStore = SystemStates & SystemActions;

const useSystemStore = create<SystemStore>((set) => ({
  ...initialState,
  createSystem: async (params: TSystemNew) => {
    set({ fetchloading: true });
    try {
      const result = await createSystem(params);
      set({ system: result });
    } catch (error) {
      console.log(error);
      set({ fetchError: errorParser(error) });
    } finally {
      set({ fetchloading: false });
    }
  },
  reset: () => set(initialState),
  clearFetchError: () => set({ fetchError: undefined }),
}));

export default useSystemStore;
