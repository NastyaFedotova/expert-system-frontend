'use client';
import React, { memo, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ObjectSchema, string } from 'yup';

import Button from '@/components/Button';
import { ErrorPopup } from '@/components/ErrorPopup';
import Input from '@/components/Input';
import Text, { TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import CloseIcon from '@/icons/CloseIcon';
import useUserStore from '@/store/userStore';
import { TUserUpdate } from '@/types/user';
import { classname } from '@/utils';

import classes from './Profile.module.scss';

const cnProfile = classname(classes, 'profile');

const validator: ObjectSchema<TUserUpdate> = object({
  username: string(),
  email: string().email('Неправильный формат'),
  first_name: string(),
  last_name: string(),
  new_password: string().matches(/.{8,}/, { message: 'Минимальная длина пароля - 8', excludeEmptyString: true }),
  password: string(),
});

const Profile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);

  const {
    user = { first_name: 'nikita', last_name: 'gordeev', email: 'nagordeev0106@yandex.ru', username: 'marryp0ppins' },
    fetchloading,
    fetchError,
  } = useUserStore((store) => store);

  const {
    register,
    getValues,
    watch,
    handleSubmit,
    trigger,
    formState: { dirtyFields, errors },
  } = useForm<TUserUpdate>({
    defaultValues: { ...user, new_password: '' },
    resolver: yupResolver(validator),
  });
  console.log(errors, !!Object.keys(errors).length, !Object.keys(dirtyFields).length);
  const handleFormSubmit = useCallback(() => {
    const data = getValues();
    console.log(dirtyFields);
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
    console.log(changedFields);
    console.log(errors);
  }, [dirtyFields, errors, getValues]);

  const formWatch = watch();

  const emptySubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      trigger();
    },
    [trigger],
  );

  return (
    <div className={cnProfile()}>
      <form className={cnProfile('form')} autoComplete="off" onChange={emptySubmit}>
        <div className={cnProfile('line')}>
          <Input
            {...register('first_name')}
            className={cnProfile('input')}
            autoComplete="off"
            label={!!formWatch.first_name?.length && 'Имя'}
            placeholder="имя"
            afterSlot={<ErrorPopup error={errors.first_name?.message || fetchError?.error} />}
            error={fetchError?.error || errors.first_name?.message}
          />
          <Input
            {...register('last_name')}
            className={cnProfile('input')}
            label={!!formWatch.last_name?.length && 'Фамилия'}
            placeholder="фамилия"
            afterSlot={<ErrorPopup error={errors.last_name?.message || fetchError?.error} />}
            error={fetchError?.error || errors.last_name?.message}
          />
        </div>
        <Input
          {...register('username')}
          className={cnProfile('input')}
          label={!!formWatch.username?.length && 'Никнейм'}
          placeholder="никнейм"
          disabled
        />
        <Input
          {...register('email')}
          className={cnProfile('input')}
          label={!!formWatch.email?.length && 'Почта'}
          placeholder="почта"
          type="email"
          afterSlot={<ErrorPopup error={errors.email?.message || fetchError?.error} />}
          error={fetchError?.error || errors.email?.message}
        />
        <Input
          {...register('new_password')}
          className={cnProfile('input')}
          label={!!formWatch.new_password?.length && 'Пароль'}
          placeholder="новый пароль"
          autoComplete="new-password"
          type="password"
          afterSlot={<ErrorPopup error={errors.new_password?.message || fetchError?.error} />}
          error={fetchError?.error || errors.new_password?.message}
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
              disabled={!Object.keys(dirtyFields).length || !!Object.keys(errors).length}
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
            <Button className={cnProfile('button')} loading={fetchloading} onClick={handleSubmit(handleFormSubmit)}>
              Подтвердить
            </Button>
          </div>
        </Popup>
      </form>
    </div>
  );
};

export default memo(Profile);
