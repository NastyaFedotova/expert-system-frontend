'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getImage } from '@/api/services/image';
import { getSystemOne, updateSystem } from '@/api/services/systems';
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
import { TSystem, TSystemsWithPage, TSystemUpdate } from '@/types/systems';
import { classname } from '@/utils';
import { systemUpdateValidation } from '@/validation/system';

import classes from './page.module.scss';

const cnSystem = classname(classes, 'editor-system');

type PageProps = {
  params: { system_id: number };
};

const Page: React.FC<PageProps> = ({ params: { system_id } }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);

  const { data } = useSuspenseQuery({
    queryKey: [SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: system_id }],
    queryFn: async () => await getSystemOne(system_id),
    initialData: () =>
      queryClient
        .getQueryData<TSystemsWithPage>([SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }])
        ?.systems.find((system) => system.id === system_id),
  });

  const { data: image } = useQuery({
    queryKey: ['image', data.image_uri],
    queryFn: async () => {
      if (data.image_uri) {
        const img = await getImage(data.image_uri);
        const dt = new DataTransfer();
        dt.items.add(img);
        return img;
        //return dt.files;
      }
    },
    gcTime: 0,
    staleTime: 0,
    enabled: !!data.image_uri,
  });

  const { mutate, isPending, error, status } = useMutation<
    TSystem,
    TErrorResponse,
    TSystemUpdate & { system_id: number }
  >({
    mutationFn: updateSystem,
    onSuccess: (data) => {
      queryClient.setQueryData([SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: system_id }], data);
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        (old?: TSystemsWithPage) => ({
          pages: old?.pages ?? 1,
          systems: old?.systems ? old.systems.map((system) => (system.id === data.id ? data : system)) : [data],
        }),
      );
    },
  });

  const {
    register,
    watch,
    handleSubmit,
    formState: { dirtyFields, errors },
    clearErrors,
    reset,
  } = useForm<TSystemUpdate>({
    defaultValues: { ...data, image },
    resolver: zodResolver(systemUpdateValidation),
  });

  useEffect(() => {
    if (status === 'success') {
      reset({ ...data, image });
    }
  }, [data, image, reset, status]);

  const handleFormSubmit = useCallback(
    (data: TSystemUpdate) => {
      type formType = keyof TSystemUpdate;
      const changedFields = Object.keys(dirtyFields).reduce((fields, field) => {
        const formField = field as formType;
        switch (formField) {
          case 'name':
            fields.name = data.name;
            return fields;
          case 'private':
            fields.private = data.private;
            return fields;
          case 'image':
            fields.image = data.image;
            return fields;
          default:
            fields[formField] = data[formField];
            return fields;
        }
      }, {} as TSystemUpdate);
      mutate({ ...changedFields, system_id: system_id });
    },
    [dirtyFields, mutate, system_id],
  );

  const formWatch = watch();

  useEffect(
    () => () => {
      clearErrors();
    },
    [clearErrors],
  );

  return (
    <main className={cnSystem('wrapper')}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={cnSystem()}>
        <Input
          {...register('name')}
          placeholder="Название системы"
          label={!!formWatch.name?.length && 'Название ситемы'}
          error={!!errors.name}
          afterSlot={<ErrorPopup error={errors.name?.message} />}
          className={cnSystem('input')}
          disabled={isPending}
        />
        <div className={cnSystem('raw')}>
          <div className={cnSystem('column')}>
            <FileUpload {...register('image')} accept="image/*" disabled={isPending} initialImageUrl={data.image_uri} />
            <div className={cnSystem('checkbox')}>
              <CheckBox {...register('private')} checked={formWatch.private} disabled={isPending} />
              <Text view={TEXT_VIEW.p18} className={cnSystem('checkbox-label')}>
                Приватная
              </Text>
            </div>
          </div>
          <TextArea
            {...register('about')}
            className={cnSystem('about')}
            placeholder="Описание системы"
            label={!!formWatch.about?.length && 'Описание системы'}
            error={!!errors.about}
            afterSlot={<ErrorPopup error={errors.about?.message} />}
            disabled={isPending}
          />
        </div>
        {!!error && (
          <Text view={TEXT_VIEW.p14} className={cnSystem('err')}>
            {error.extra ?? error.error}
          </Text>
        )}
        <Button
          className={cnSystem('button')}
          disabled={!Object.keys(dirtyFields).length || !!Object.keys(errors).length}
          loading={isPending}
        >
          Сохранить изменения
        </Button>
      </form>
    </main>
  );
};

export default memo(Page);
