'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/Button';
import ErrorPopup from '@/components/ErrorPopup';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import useUserStore from '@/store/userStore';
import { TUserRegistration } from '@/types/user';
import { classname } from '@/utils';
import { userRegistrationValidation } from '@/validation/user';

import classes from './page.module.scss';

const cnRegistrationPage = classname(classes, 'registrationPage');

const Page: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<TUserRegistration>({ resolver: zodResolver(userRegistrationValidation), mode: 'all' });
  const { registrationUser, fetchloading, successfulRegistration, fetchError, clearFetchError } = useUserStore(
    (store) => store,
  );
  const handleRegistration = useCallback(
    (data: TUserRegistration) => {
      registrationUser(data);
    },
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
      {successfulRegistration ? (
        <Text view={TEXT_VIEW.p20} className={cnRegistrationPage('verified')}>
          {`На почту ${getValues('email')} отправлено письмо для подтверждения аккаунта`}
        </Text>
      ) : (
        <form className={cnRegistrationPage()} onSubmit={handleSubmit(handleRegistration)}>
          <Text view={TEXT_VIEW.p20} className={cnRegistrationPage('title')}>
            Регистрация
          </Text>
          <Input
            {...register('username')}
            className={cnRegistrationPage('input')}
            placeholder="Никнейм"
            label={formWatch.username?.length ? 'Никнейм' : undefined}
            afterSlot={<ErrorPopup error={errors.username?.message} />}
            error={!!errors.username}
          />
          <Input
            {...register('email')}
            className={cnRegistrationPage('input')}
            placeholder="Почта"
            label={formWatch.email?.length ? 'Почта' : undefined}
            afterSlot={<ErrorPopup error={errors.email?.message} />}
            error={!!errors.email}
          />
          <Input
            {...register('first_name')}
            className={cnRegistrationPage('input')}
            placeholder="Имя"
            label={formWatch.first_name?.length ? 'Имя' : undefined}
            afterSlot={<ErrorPopup error={errors.first_name?.message} />}
            error={!!errors.first_name}
          />
          <Input
            {...register('last_name')}
            className={cnRegistrationPage('input')}
            placeholder="Фамилия"
            label={formWatch.last_name?.length ? 'Фамилия' : undefined}
            afterSlot={<ErrorPopup error={errors.last_name?.message} />}
            error={!!errors.last_name}
          />
          <Input
            {...register('password')}
            className={cnRegistrationPage('input')}
            placeholder="Пароль"
            label={formWatch.password?.length ? 'Пароль' : undefined}
            afterSlot={<ErrorPopup error={errors.password?.message} />}
            type="password"
            error={!!errors.password}
          />
          <Input
            {...register('password_submit')}
            className={cnRegistrationPage('input')}
            placeholder="Подтвердите пароль"
            label={formWatch.password_submit?.length ? 'Подтвердите пароль' : undefined}
            afterSlot={<ErrorPopup error={errors.password_submit?.message} />}
            type="password"
            error={!!errors.password_submit}
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
      )}
    </main>
  );
};

export default memo(Page);
