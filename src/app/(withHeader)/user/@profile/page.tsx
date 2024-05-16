'use client';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { zodResolver } from '@hookform/resolvers/zod';
import dynamic from 'next/dynamic';

import Button from '@/components/Button';
import ErrorPopup from '@/components/ErrorPopup';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import Text, { TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import CloseIcon from '@/icons/CloseIcon';
import useUserStore from '@/store/userStore';
import { TUserUpdate } from '@/types/user';
import { classname } from '@/utils';
import { userUpdateValidation } from '@/validation/user';

import classes from './page.module.scss';

const cnProfile = classname(classes, 'profile');

const Page: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);

  const { user, fetchloading, clearFetchError, fetchError, updateUser } = useUserStore((store) => store);

  const {
    register,
    getValues,
    watch,
    handleSubmit,
    reset,
    resetField,
    formState: { dirtyFields, errors, isValid },
    clearErrors,
  } = useForm<TUserUpdate>({
    defaultValues: { ...user, new_password: '' },
    resolver: zodResolver(userUpdateValidation),
    mode: 'all',
  });

  const handleFormSubmit = useCallback(() => {
    closePopup();
    const data = getValues();

    type formType = keyof TUserUpdate;
    const changedFields = Object.keys(dirtyFields).reduce((fields, field) => {
      const formField = field as formType;
      if (formField === 'password') {
        fields.password = data.password;
      } else {
        fields[formField] = data[formField];
      }
      return fields;
    }, {} as TUserUpdate);

    updateUser(changedFields);
    resetField('password');
    resetField('new_password');
  }, [closePopup, dirtyFields, getValues, resetField, updateUser]);

  const formWatch = watch();

  useEffect(() => {
    reset({ ...user, new_password: '' });
    return () => {
      clearFetchError();
      clearErrors();
    };
  }, [clearErrors, clearFetchError, reset, user]);

  return (
    <div className={cnProfile()}>
      <form className={cnProfile('form')} autoComplete="off">
        <div className={cnProfile('line')}>
          <Input
            {...register('first_name')}
            className={cnProfile('input')}
            autoComplete="off"
            label={formWatch.first_name?.length ? 'Имя' : undefined}
            placeholder="Имя"
            afterSlot={<ErrorPopup error={errors.first_name?.message} />}
            error={!!errors.first_name}
          />
          <Input
            {...register('last_name')}
            className={cnProfile('input')}
            label={formWatch.last_name?.length ? 'Фамилия' : undefined}
            placeholder="Фамилия"
            afterSlot={<ErrorPopup error={errors.last_name?.message} />}
            error={!!errors.last_name}
          />
        </div>
        <Input
          {...register('username')}
          className={cnProfile('input')}
          label={formWatch.username?.length ? 'Никнейм' : undefined}
          placeholder="Никнейм"
          disabled
        />
        <Input
          {...register('email')}
          className={cnProfile('input')}
          label={formWatch.email?.length ? 'Почта' : undefined}
          placeholder="Почта"
          type="email"
          afterSlot={<ErrorPopup error={errors.email?.message} />}
          error={!!errors.email}
        />
        <Input
          {...register('new_password')}
          className={cnProfile('input')}
          label={formWatch.new_password?.length ? 'Пароль' : undefined}
          placeholder="Новый пароль"
          autoComplete="new-password"
          type="password"
          afterSlot={<ErrorPopup error={errors.new_password?.message} />}
          error={!!errors.new_password}
        />
        {!!fetchError && (
          <Text view={TEXT_VIEW.p14} className={cnProfile('err')}>
            {fetchError.extra ?? fetchError.error}
          </Text>
        )}
        <Popup
          trigger={
            <Button
              className={cnProfile('button')}
              type="button"
              disabled={!Object.keys(dirtyFields).length || !isValid}
              loading={fetchloading}
            >
              Сохранить изменения
            </Button>
          }
          open={isOpen}
          onClose={closePopup}
          onOpen={openPopup}
          modal
          closeOnDocumentClick
          repositionOnResize
          closeOnEscape
        >
          <div className={cnProfile('modal')}>
            <CloseIcon className={cnProfile('closeIcon')} onClick={closePopup} />
            <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnProfile('modal-text')}>
              Подтверждение действий
            </Text>
            <Text view={TEXT_VIEW.p16} className={cnProfile('modal-text')}>
              {`Для подтверждения действия Вам необходимо ввести ${dirtyFields.new_password ? 'старый' : ''} пароль от вашей учетной записи.`}
            </Text>
            <Input
              {...register('password')}
              className={cnProfile('input', { modal: true })}
              required
              placeholder={dirtyFields.new_password ? 'введите старый пароль' : 'введите пароль'}
              autoComplete="new-password"
              type="password"
            />
            <Button
              className={cnProfile('button')}
              onClick={handleSubmit(handleFormSubmit)}
              disabled={!formWatch.password?.length}
            >
              Подтвердить
            </Button>
          </div>
        </Popup>
      </form>
    </div>
  );
};

export default dynamic(() => Promise.resolve(memo(Page)), { ssr: false, loading: () => <Loader sizepx={116} /> });
