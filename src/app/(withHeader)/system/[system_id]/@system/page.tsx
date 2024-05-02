'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { boolean, mixed, object, ObjectSchema, string } from 'yup';

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

import classes from './page.module.scss';

const cnSystem = classname(classes, 'editor-system');

export type SystemContainerProps = {
  params: { system_id: number };
};

const validator: ObjectSchema<TSystemUpdate> = object({
  name: string().required('Обязательное поле').max(128, 'Максимальная длина - 128'),
  about: string().max(1024, 'Максимальная длина - 1024'),
  private: boolean().required(),
  image: mixed<FileList>(),
});

const SystemContainer: React.FC<SystemContainerProps> = ({ params: { system_id } }) => {
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
        return dt.files;
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
      console.log([SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: system_id }]);
      queryClient.setQueryData([SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: system_id }], data);
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
    resolver: yupResolver(validator),
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
            fields.name = data.name;
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

export default memo(SystemContainer);
