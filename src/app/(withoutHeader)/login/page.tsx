'use client';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { loginUserResponse } from '@/api/services/user';
import Button from '@/components/Button';
import ErrorPopup from '@/components/ErrorPopup';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import { USER } from '@/constants';
import useUserStore from '@/store/userStore';
import { TUserLogin } from '@/types/user';
import { classname, errorParser } from '@/utils';
import { userLoginValidation } from '@/validation/user';

import classes from './page.module.scss';

const cnLoginPage = classname(classes, 'loginPage');

const Page: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setStates = useUserStore((store) => store.setStates);

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<TUserLogin>({
    resolver: zodResolver(userLoginValidation),
    mode: 'all',
  });

  const { mutate, error, isPending } = useMutation({
    mutationKey: [USER.LOGIN],
    mutationFn: loginUserResponse,
    onSuccess: (user) => {
      setStates({ user, isLogin: true });
      router.replace(searchParams?.get('back_uri') ?? '/');
    },
    gcTime: 0,
  });

  const parseError = useMemo(() => error && errorParser(error), [error]);

  const handleLogin = useCallback((data: TUserLogin) => mutate(data), [mutate]);

  const formWatch = watch();

  useEffect(
    () => () => {
      clearErrors();
    },
    [clearErrors],
  );

  return (
    <main className={cnLoginPage('wrapper')}>
      <form className={cnLoginPage()} onSubmit={handleSubmit(handleLogin)}>
        <Text view={TEXT_VIEW.p20} className={cnLoginPage('title')}>
          Авторизация
        </Text>
        <Input
          {...register('email')}
          className={cnLoginPage('input')}
          placeholder="Почта"
          label={formWatch.email?.length ? 'Почта' : undefined}
          type="email"
          error={!!parseError}
          afterSlot={<ErrorPopup error={errors.email?.message} />}
        />
        <Input
          {...register('password')}
          className={cnLoginPage('input')}
          placeholder="Пароль"
          label={formWatch.password?.length ? 'Пароль' : undefined}
          type="password"
          error={!!parseError}
        />
        {!!parseError && (
          <Text view={TEXT_VIEW.p14} className={cnLoginPage('err')}>
            {parseError.extra ?? parseError.error}
          </Text>
        )}
        <Button className={cnLoginPage('button')} loading={isPending}>
          Войти
        </Button>
        <div className={cnLoginPage('links')}>
          <Link href="/registration">
            <Text view={TEXT_VIEW.p14} className={cnLoginPage('reg')}>
              Регистрация
            </Text>
          </Link>
          <Link href="/forgotpassword">
            <Text view={TEXT_VIEW.p14} className={cnLoginPage('forgot')}>
              Забыли пароль?
            </Text>
          </Link>
        </div>
      </form>
    </main>
  );
};

export default memo(Page);
