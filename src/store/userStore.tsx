import Cookies from 'js-cookie';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { create } from 'zustand';

import {
  loginUserResponse,
  logoutUserResponse,
  registrationUserResponse,
  updateUserResponse,
  userResponse,
} from '@/api/services/user';
import { TErrorResponse } from '@/types/error';
import { TUser, TUserLogin, TUserRegistration, TUserUpdate } from '@/types/user';

type UserStates = {
  isLogin: boolean;
  user?: TUser;
  fetchloading: boolean;
  fetchError?: TErrorResponse;
  router?: AppRouterInstance;
  searchParams?: ReadonlyURLSearchParams;
};

type UserActions = {
  loginUser: (params: TUserLogin) => void;
  registrationUser: (params: TUserRegistration & { password2: string }) => void;
  updateUser: (params: TUserUpdate) => void;
  loginUserByCookie: () => void;
  logoutUser: () => void;
  setHooks: ({ router, searchParams }: { router?: AppRouterInstance; searchParams: ReadonlyURLSearchParams }) => void;
  reset: () => void;
};

const initialState: UserStates = {
  isLogin: false,
  user: undefined,
  fetchloading: false,
  fetchError: undefined,
};

export type UserStore = UserStates & UserActions;

const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,
  loginUser: async (params: TUserLogin) => {
    set({ fetchloading: true });
    Cookies.remove('session_id');
    try {
      const result = await loginUserResponse(params);
      const session_key = Cookies.get('session_id');
      if (!session_key) {
        const err: TErrorResponse = {
          error: 'Не удалось авторизоваться',
          status: 0,
        };
        throw JSON.stringify(err);
      }
      const redirect_to = get().searchParams?.get('back_uri');
      console.log(redirect_to);
      set({ isLogin: true, user: result });
      get().router?.replace(redirect_to ?? '/');
    } catch (error) {
      set({ fetchError: JSON.parse(error as string) as TErrorResponse });
    } finally {
      set({ fetchloading: false });
    }
  },
  loginUserByCookie: async () => {
    set({ fetchloading: true });
    try {
      const result = await userResponse();
      set({ isLogin: true, user: result });
    } catch (error) {
      Cookies.remove('session_id');
    } finally {
      set({ fetchloading: false });
    }
  },
  registrationUser: async (params: TUserRegistration & { password2: string }) => {
    set({ fetchloading: true });
    Cookies.remove('session_id');
    try {
      if (params.password !== params.password2) {
        const err: TErrorResponse = {
          error: 'Пароли не совпадают',
          status: 0,
        };
        throw JSON.stringify(err);
      }
      const result = await registrationUserResponse(params);

      const session_key = Cookies.get('session_id');
      if (!session_key) {
        const err: TErrorResponse = {
          error: 'Не удалось авторизоваться',
          status: 0,
        };
        throw JSON.stringify(err);
      }

      set({ isLogin: true, user: result });
      get().router?.push('/');
    } catch (error) {
      console.log(error);
      set({ fetchError: JSON.parse(error as string) as TErrorResponse });
    } finally {
      set({ fetchloading: false });
    }
  },
  updateUser: async (params: TUserUpdate) => {
    set({ fetchloading: true });
    try {
      const result = await updateUserResponse(params);
      set({ user: result });
    } catch (error) {
      console.log(error);
      set({ fetchError: JSON.parse(error as string) as TErrorResponse });
    } finally {
      set({ fetchloading: false });
    }
  },
  logoutUser: async () => {
    try {
      await logoutUserResponse();
      get().router?.replace('/');
      Cookies.remove('session_id');
    } catch (error) {
      console.log(error);
    }
  },
  setHooks: ({ router, searchParams }) => {
    set({ router, searchParams });
  },
  reset: () => set(initialState),
}));

// const UserStoreContext = createContext<StoreApi<UserStore> | null>(null);

// export const UserProvider = ({ children }: { children: ReactNode }) => {
//   const storeRef = useRef<StoreApi<UserStore>>();

//   const router = useRouter();

//   if (!storeRef.current) {
//     storeRef.current = createUserStore({ ...initialState, router });
//   }

//   storeRef.current.getState().loginUserByCookie();
//   return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
// };

// const useUserStores = <T,>(selector: (store: UserStore) => T): T => {
//   const counterStoreContext = useContext(UserStoreContext);

//   if (!counterStoreContext) {
//     throw new Error(`useCounterStore must be use within CounterStoreProvider`);
//   }

//   return useStore(counterStoreContext, selector);
// };

export default useUserStore;
