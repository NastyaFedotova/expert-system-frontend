'use client';
import React, { memo, useCallback } from 'react';
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
  const { register, handleSubmit } = useForm<TUserRegistration & { password2: string }>();
  const { registrationUser, fetchloading, fetchError } = useUserStore((store) => store);
  const handleRegistration = useCallback(
    (data: TUserRegistration & { password2: string }) => registrationUser(data),
    [registrationUser],
  );

  return (
    <form className={cnRegistrationPage()} onSubmit={handleSubmit(handleRegistration)}>
      <Text view={TEXT_VIEW.p20} className={cnRegistrationPage('title')}>
        Регистрация
      </Text>
      <Input
        {...register('username')}
        className={cnRegistrationPage('input')}
        placeholder="никнейм"
        error={!!fetchError}
      />
      <Input
        {...register('email')}
        className={cnRegistrationPage('input')}
        placeholder="почта"
        type="email"
        error={!!fetchError}
      />
      <Input
        {...register('first_name')}
        className={cnRegistrationPage('input')}
        placeholder="имя"
        error={!!fetchError}
      />
      <Input
        {...register('last_name')}
        className={cnRegistrationPage('input')}
        placeholder="фамилия"
        error={!!fetchError}
      />
      <Input
        {...register('password')}
        className={cnRegistrationPage('input')}
        placeholder="пароль"
        type="password"
        error={!!fetchError}
      />
      <Input
        {...register('password2')}
        className={cnRegistrationPage('input')}
        placeholder="подтвердите пароль"
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
  );
};

export default memo(Page);
