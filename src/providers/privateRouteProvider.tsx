'use client';
import { ReactNode, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { redirect, usePathname, useSearchParams } from 'next/navigation';

import { USER } from '@/constants';
import useUserStore from '@/store/userStore';

const allowURL = [/^\/$/, /^\/login$/, /^\/registration$/, /^\/systems\/\d+\/test$/];

export const PrivateRouterProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const loginUserByCookie = useUserStore((store) => store.loginUserByCookie);

  useQuery({ queryKey: [USER.COOKIE], queryFn: loginUserByCookie, staleTime: 0, gcTime: 0 });

  useLayoutEffect(() => {
    if (!Cookies.get('session_id') && !allowURL.find((url) => new RegExp(url, 'm').test(pathname))) {
      redirect(`/login?back_uri=${pathname}?${searchParams.toString()}`);
    }
  }, [pathname, searchParams]);

  return children;
};
