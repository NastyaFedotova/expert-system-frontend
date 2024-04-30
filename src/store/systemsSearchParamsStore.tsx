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

export default useSystemsSearchParamsStore;
