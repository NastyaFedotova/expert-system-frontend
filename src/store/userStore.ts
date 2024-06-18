import { create } from 'zustand';

import { TUser } from '@/types/user';

type TUserStates = {
  isLogin?: boolean;
  user?: TUser;
};

type TUserActions = {
  reset: () => void;
  setStates: (params: Partial<TUserStates>) => void;
};

const initialState: TUserStates = {
  isLogin: undefined,
  user: undefined,
};

export type TUserStore = TUserStates & TUserActions;

const useUserStore = create<TUserStore>((set) => ({
  ...initialState,
  setStates: (params) => set(params),
  reset: () => set({ ...initialState, isLogin: false }),
}));

export default useUserStore;
