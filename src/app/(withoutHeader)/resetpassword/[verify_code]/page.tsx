'use client';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { resetPasswordPost } from '@/api/services/user';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import { USER } from '@/constants';
import { ResetPassword } from '@/types/user';
import { classname, errorParser } from '@/utils';
import { verifyEmailValidation } from '@/validation/searchParams';
import { resetPasswordValidation } from '@/validation/user';

import classes from './page.module.scss';

const cnLoginPage = classname(classes, 'loginPage');

type ResetPasswordPageLayoutProps = {
  params: { verify_code: string };
};

const Page: React.FC<ResetPasswordPageLayoutProps> = ({ params }) => {
  const router = useRouter();
  const verify_code = useMemo(() => verifyEmailValidation.safeParse(params).data?.verify_code, [params]);
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ResetPassword>({
    resolver: zodResolver(resetPasswordValidation),
    mode: 'all',
  });

  const { mutate, error, isPending, isSuccess } = useMutation({
    mutationKey: [USER.FORGOTPASSWORD],
    mutationFn: resetPasswordPost,
    onSuccess: () => {
      router.replace('/');
    },
    gcTime: 0,
  });

  const handleLogin = useCallback(
    (data: ResetPassword) => {
      if (verify_code) {
        mutate({ ...data, verify_code });
      }
    },
    [mutate, verify_code],
  );
  const parseError = useMemo(() => error && errorParser(error), [error]);

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
          Восстановление пароля
        </Text>
        <Input
          {...register('password')}
          className={cnLoginPage('input')}
          placeholder="Пароль"
          label={formWatch.password?.length ? 'Пароль' : undefined}
          type="password"
          error={!!errors.password}
        />
        <Input
          {...register('password_submit')}
          className={cnLoginPage('input')}
          placeholder="Подтверждение пароля"
          label={formWatch.password?.length ? 'Подтверждение пароля' : undefined}
          type="password"
          error={!!errors.password_submit}
        />
        {!!parseError && (
          <Text view={TEXT_VIEW.p14} className={cnLoginPage('err')}>
            {parseError.extra ?? parseError.error}
          </Text>
        )}
        {!isSuccess && !parseError && (
          <Button className={cnLoginPage('button')} loading={isPending}>
            Сохранить пароль
          </Button>
        )}
      </form>
    </main>
  );
};

export default memo(Page);
