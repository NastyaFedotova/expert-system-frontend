'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import useUserStore from '@/store/userStore';
import { TUserRegistration } from '@/types/user';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnRegistrationPage = classname(classes, 'registrationPage');

const Page: React.FC = () => {
  const { register, handleSubmit, watch, clearErrors } = useForm<TUserRegistration & { password2: string }>();
  const { registrationUser, fetchloading, fetchError, clearFetchError } = useUserStore((store) => store);
  const handleRegistration = useCallback(
    (data: TUserRegistration & { password2: string }) => registrationUser(data),
    [registrationUser],
  );

  const formWatch = watch();

  useEffect(
    () => () => {
      clearFetchError();
      clearErrors();
    },
    [clearErrors, clearFetchError],
  );

  return (
    <main className={cnRegistrationPage('wrapper')}>
      <form className={cnRegistrationPage()} onSubmit={handleSubmit(handleRegistration)}>
        <Text view={TEXT_VIEW.p20} className={cnRegistrationPage('title')}>
          Регистрация
        </Text>
        <Input
          {...register('username')}
          className={cnRegistrationPage('input')}
          placeholder="Никнейм"
          label={!!formWatch.username?.length && 'Никнейм'}
          error={!!fetchError}
        />
        <Input
          {...register('email')}
          className={cnRegistrationPage('input')}
          placeholder="Почта"
          label={!!formWatch.email?.length && 'Почта'}
          type="email"
          error={!!fetchError}
        />
        <Input
          {...register('first_name')}
          className={cnRegistrationPage('input')}
          placeholder="Имя"
          label={!!formWatch.first_name?.length && 'Имя'}
          error={!!fetchError}
        />
        <Input
          {...register('last_name')}
          className={cnRegistrationPage('input')}
          placeholder="Фамилия"
          label={!!formWatch.last_name?.length && 'Фамилия'}
          error={!!fetchError}
        />
        <Input
          {...register('password')}
          className={cnRegistrationPage('input')}
          placeholder="Пароль"
          label={!!formWatch.password?.length && 'Пароль'}
          type="password"
          error={!!fetchError}
        />
        <Input
          {...register('password2')}
          className={cnRegistrationPage('input')}
          placeholder="Подтвердите пароль"
          label={!!formWatch.password2?.length && 'Повторный пароль'}
          type="password"
          error={!!fetchError}
        />
        {!!fetchError && (
          <Text view={TEXT_VIEW.p14} className={cnRegistrationPage('err')}>
            {fetchError.extra ?? fetchError.error}
          </Text>
        )}
        <Button className={cnRegistrationPage('button')} loading={fetchloading}>
          Зарегистрироваться
        </Button>
      </form>
    </main>
  );
};

export default memo(Page);
