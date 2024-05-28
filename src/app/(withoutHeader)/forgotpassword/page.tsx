'use client';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { forgotPasswordPost } from '@/api/services/user';
import Button from '@/components/Button';
import ErrorPopup from '@/components/ErrorPopup';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import { USER } from '@/constants';
import { ForgotPassword } from '@/types/user';
import { classname, errorParser } from '@/utils';
import { forgotPasswordValidation } from '@/validation/user';

import classes from './page.module.scss';

const cnLoginPage = classname(classes, 'loginPage');

const Page: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPassword>({
    resolver: zodResolver(forgotPasswordValidation),
    mode: 'all',
  });
  const formWatch = watch();

  const { mutate, isSuccess, error, isPending } = useMutation({
    mutationKey: [USER.FORGOTPASSWORD],
    mutationFn: forgotPasswordPost,
    gcTime: 0,
  });

  const handleLogin = useCallback((data: ForgotPassword) => mutate(data), [mutate]);
  const parseError = useMemo(() => error && errorParser(error), [error]);

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
          Востановление пароля
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
        {!!parseError && (
          <Text view={TEXT_VIEW.p14} className={cnLoginPage('err')}>
            {parseError.extra ?? parseError.error}
          </Text>
        )}
        {isSuccess && (
          <Text view={TEXT_VIEW.p14} className={cnLoginPage('ok')}>
            Код отправлен на указанную почту
          </Text>
        )}
        {!isSuccess && !parseError && (
          <Button className={cnLoginPage('button')} loading={isPending}>
            Отправить код
          </Button>
        )}
      </form>
    </main>
  );
};

export default memo(Page);
