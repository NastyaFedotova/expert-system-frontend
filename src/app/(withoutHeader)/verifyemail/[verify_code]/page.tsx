'use client';
import React, { memo, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { emailVerifyPost } from '@/api/services/user';
import Loader from '@/components/Loader';
import Text from '@/components/Text';
import { USER } from '@/constants';
import useUserStore from '@/store/userStore';
import { classname, errorParser } from '@/utils';
import { verifyEmailValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnLoginPage = classname(classes, 'verifyEmailPage');

type VerifyEmailPageLayoutProps = {
  params: { verify_code: string };
};

const Page: React.FC<VerifyEmailPageLayoutProps> = ({ params }) => {
  const router = useRouter();
  const verify_code = useMemo(() => verifyEmailValidation.safeParse(params).data?.verify_code, [params]);
  const setStates = useUserStore((store) => store.setStates);
  const { isSuccess, error, data } = useQuery({
    queryKey: [USER.EMAILVERIFY, verify_code],
    queryFn: () => emailVerifyPost(verify_code ?? ''),
    enabled: !!verify_code,
    gcTime: 0,
    staleTime: 0,
  });

  const parseError = useMemo(() => error && errorParser(error), [error]);

  useEffect(() => {
    if (isSuccess) {
      setStates({ user: data, isLogin: true });
      router.replace('/');
    }
  }, [data, isSuccess, router, setStates]);

  return (
    <main className={cnLoginPage('wrapper')}>
      {parseError ? <Text>{parseError.error}</Text> : <Loader sizepx={116} />}
    </main>
  );
};

export default memo(Page);
