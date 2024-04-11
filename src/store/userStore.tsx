import { createContext, ReactNode, useContext, useRef } from 'react';
import Cookies from 'js-cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { useStore } from 'zustand';
import { createStore, StoreApi } from 'zustand/vanilla';

import { loginUserResponse, logoutUserResponse, registrationUserResponse } from '@/api/services/user';
import { TErrorResponse } from '@/types/error';
import { TUser, TUserLogin, TUserRegistration } from '@/types/user';

type UserStates = {
  isLogin: boolean;
  user?: TUser;
  loginFetchloading: boolean;
  loginFetchError?: TErrorResponse;
  router?: AppRouterInstance;
  redirect_to: string;
};

type UserActions = {
  loginUser: (params: TUserLogin) => void;
  registrationUser: (params: TUserRegistration & { password2: string }) => void;
  logoutUser: () => void;
  setRedirectUrl: (pathname: string) => void;
};

const initialState: UserStates = {
  isLogin: false,
  user: undefined,
  loginFetchloading: false,
  loginFetchError: undefined,
  redirect_to: '/',
};

export type UserStore = UserStates & UserActions;

const createUserStore = (initState: UserStates = initialState) => {
  return createStore<UserStore>()((set, get) => ({
    ...initState,
    loginUser: async (params: TUserLogin) => {
      set({ loginFetchloading: true });
      try {
        const result = await loginUserResponse(params);
        set({ isLogin: true, user: result });
        get().router?.replace(get().redirect_to);
        set({ redirect_to: '/' });
      } catch (error) {
        set({ loginFetchError: JSON.parse(error as string) as TErrorResponse });
      } finally {
        set({ loginFetchloading: false });
      }
    },
    registrationUser: async (params: TUserRegistration & { password2: string }) => {
      set({ loginFetchloading: true });
      try {
        if (params.password !== params.password2) {
          const err: TErrorResponse = {
            error: 'Пароли не совпадают',
            status: 0,
          };
          throw JSON.stringify(err);
        }
        const result = await registrationUserResponse(params);
        set({ isLogin: true, user: result });
        get().router?.push('/');
      } catch (error) {
        console.log(error);
        set({ loginFetchError: JSON.parse(error as string) as TErrorResponse });
      } finally {
        set({ loginFetchloading: false });
      }
    },
    logoutUser: async () => {
      try {
        await logoutUserResponse();
        set(initState);
        Cookies.remove('session_id');
        get().router?.push('/');
      } catch (error) {
        console.log(error);
      }
    },
    setRedirectUrl: (pathname: string) => set({ redirect_to: pathname }),
  }));
};

const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<UserStore>>();

  const router = useRouter();

  if (!storeRef.current) {
    storeRef.current = createUserStore({ ...initialState, router });
  }

  return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
};

const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const counterStoreContext = useContext(UserStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};

export default useUserStore;
