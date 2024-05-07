'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

import Button from '@/components/Button';
import Input from '@/components/Input';
import useSystemsSearchParamsStore from '@/store/systemsSearchParamsStore';
import { TSystemRequestParams } from '@/types/systems';
import { classname } from '@/utils';
import { mainPageSearchParamsParse } from '@/utils/searchParams';

import classes from './SearchSystemContainer.module.scss';

const cnSearchSystem = classname(classes, 'searchSystemContainer');

type TSystemSearchForm = Omit<TSystemRequestParams, 'per_page' | 'page'>;

export const SearchSystemContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const setSearchParams = useSystemsSearchParamsStore((store) => store.setSearchParamsPage);
  const setSearchParamsPage = useSystemsSearchParamsStore((store) => store.setSearchParamsPage);
  const validateParams = mainPageSearchParamsParse(searchParams);
  const { register, handleSubmit, watch } = useForm<TSystemSearchForm>({
    defaultValues: { name: validateParams.name, username: validateParams.username },
  });

  const submitButton = useCallback(
    (data: TSystemSearchForm) => {
      setSearchParams(data);
      setSearchParamsPage({ currentPage: 1 });
    },
    [setSearchParams, setSearchParamsPage],
  );

  const formWatch = watch();

  return (
    <form onSubmit={handleSubmit(submitButton)} className={cnSearchSystem()}>
      <Input
        {...register('name')}
        placeholder="Название системы"
        label={!!formWatch.name?.length && 'Название'}
        className={cnSearchSystem('input')}
      />
      <Input
        {...register('username')}
        placeholder="Никнейм пользователя"
        label={!!formWatch.username?.length && 'Никнейм'}
        className={cnSearchSystem('input')}
      />
      <Button>Поиск</Button>
    </form>
  );
};
