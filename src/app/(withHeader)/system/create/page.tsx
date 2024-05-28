'use client';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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
import { TSystem, TSystemNew, TSystemsWithPage } from '@/types/systems';
import { classname, errorParser } from '@/utils';
import { systemNewValidation } from '@/validation/system';

import classes from './page.module.scss';

const cnSystemCreatePage = classname(classes, 'systemCreatePage');

const Page: React.FC = () => {
  const router = useRouter();
  const user = useUserStore((store) => store.user);
  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<TSystemNew>({
    defaultValues: { private: true },
    resolver: zodResolver(systemNewValidation),
    mode: 'all',
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, error, status, data } = useMutation<TSystem, TErrorResponse, TSystemNew>({
    mutationFn: createSystem,
    onSuccess: (data) => {
      queryClient.setQueryData([SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: data.id }], data);
      const user_systems = queryClient.getQueryData<TSystemsWithPage>([
        SYSTEMS.GET_USER,
        { user_id: user?.id, all_types: true },
      ]);
      if (user_systems?.systems.length) {
        queryClient.setQueryData<TSystemsWithPage>(
          [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
          (old?: TSystemsWithPage) => ({
            pages: old?.pages ?? 1,
            systems: [data].concat(old?.systems ?? []),
          }),
        );
      }
    },
  });

  const createError = useMemo(() => (error ? errorParser(error) : undefined), [error]);

  const handleFormSubmit = useCallback((data: TSystemNew) => mutate(data), [mutate]);

  const formWatch = useMemo(() => watch(), [watch]);

  useEffect(() => {
    if (status === 'success') {
      router.push(`/system/${data.id}/editor`);
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className={cnSystemCreatePage('form')}>
          <Input
            {...register('name')}
            placeholder="Название системы"
            label={formWatch.name?.length ? 'Название ситемы' : undefined}
            error={!!errors.name}
            afterSlot={<ErrorPopup error={errors.name?.message} />}
            className={cnSystemCreatePage('input')}
          />
          <div className={cnSystemCreatePage('raw')}>
            <div className={cnSystemCreatePage('column')}>
              <FileUpload {...register('image')} accept="image/*" />
              <div className={cnSystemCreatePage('checkbox')}>
                <CheckBox {...register('private')} checked={formWatch.private} />
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
          {!!createError && (
            <Text view={TEXT_VIEW.p14} className={cnSystemCreatePage('err')}>
              {createError.extra ?? createError.error}
            </Text>
          )}
          <Button className={cnSystemCreatePage('button')} disabled={!isValid} loading={isPending}>
            Cоздать систему
          </Button>
        </form>
      </main>
    </div>
  );
};

export default memo(Page);
