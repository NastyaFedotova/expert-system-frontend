'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { boolean, mixed, object, ObjectSchema, string } from 'yup';

import { createSystem } from '@/api/services/systems';
import Button from '@/components/Button';
import CheckBox from '@/components/CheckBox';
import ErrorPopup from '@/components/ErrorPopup';
import FileUpload from '@/components/FileUpload';
import Input from '@/components/Input';
import Text, { TEXT_VIEW } from '@/components/Text';
import TextArea from '@/components/TextArea';
import { SYSTEMS } from '@/constants';
import useUserStore from '@/store/userStore';
import { TErrorResponse } from '@/types/error';
import { TSystem, TSystemNew } from '@/types/systems';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnSystemCreatePage = classname(classes, 'systemCreatePage');

const validator: ObjectSchema<TSystemNew> = object({
  name: string().required('Обязательное поле').max(128, 'Максимальная длина - 128'),
  about: string().max(1024, 'Максимальная длина - 1024'),
  private: boolean().required(),
  image: mixed(),
});

const Page: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((store) => store.user);
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<TSystemNew>({
    defaultValues: { private: true },
    resolver: yupResolver(validator),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error, status, data } = useMutation<TSystem, TErrorResponse, TSystemNew>({
    mutationFn: createSystem,
    onSuccess: (data) => queryClient.setQueryData([SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: data.id }], data),
  });

  const handleFormSubmit = useCallback(
    (data: TSystemNew) => {
      // const data = getValues();

      // type formType = keyof TSystemNew;
      // const changedFields = Object.keys(dirtyFields).reduce((fields, field) => {
      //   const formField = field as formType;
      //   switch (formField) {
      //     case 'name':
      //       fields.name = data.name;
      //       return fields;
      //     case 'private':
      //       fields.name = data.name;
      //       return fields;
      //     case 'image':
      //       fields.image = data.image;
      //       return fields;
      //     default:
      //       fields[formField] = data[formField];
      //       return fields;
      //   }
      // }, {} as TSystemNew);
      console.log(data);
      //createSystem(data);
      mutate(data);
    },
    [mutate],
  );

  const formWatch = watch();

  const emptySubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      trigger();
    },
    [trigger],
  );

  useEffect(() => {
    if (status === 'success') {
      router.push(`/system/${data.id}`);
    }
  }, [data, isPending, router, status]);

  useEffect(
    () => () => {
      clearErrors();
    },
    [clearErrors],
  );

  return (
    <div className={cnSystemCreatePage()}>
      <header className={cnSystemCreatePage('header')}>
        <Text view={TEXT_VIEW.title} className={cnSystemCreatePage('title')}>
          Создание новой системы
        </Text>
      </header>
      <main>
        <form onSubmit={handleSubmit(handleFormSubmit)} className={cnSystemCreatePage('form')} onChange={emptySubmit}>
          <Input
            {...register('name')}
            placeholder="Название системы"
            label={!!formWatch.name?.length && 'Название ситемы'}
            error={!!errors.name}
            afterSlot={<ErrorPopup error={errors.name?.message} />}
            className={cnSystemCreatePage('input')}
          />
          <div className={cnSystemCreatePage('raw')}>
            <div className={cnSystemCreatePage('column')}>
              <FileUpload {...register('image')} accept="image/*" />
              <div className={cnSystemCreatePage('checkbox-wrapper')}>
                <CheckBox
                  {...register('private')}
                  checked={formWatch.private}
                  className={cnSystemCreatePage('checkbox')}
                />
                <Text view={TEXT_VIEW.p18} className={cnSystemCreatePage('checkbox-label')}>
                  Приватная
                </Text>
              </div>
            </div>
            <TextArea
              {...register('about')}
              className={cnSystemCreatePage('about')}
              placeholder="Описание системы"
              label={!!formWatch.about?.length && 'Описание системы'}
              error={!!errors.about}
              afterSlot={<ErrorPopup error={errors.about?.message} />}
            />
          </div>
          {!!error && (
            <Text view={TEXT_VIEW.p14} className={cnSystemCreatePage('err')}>
              {error.extra ?? error.error}
            </Text>
          )}
          <Button className={cnSystemCreatePage('button')} disabled={!!Object.keys(errors).length} loading={isPending}>
            Cоздать систему
          </Button>
        </form>
      </main>
    </div>
  );
};

export default memo(Page);
