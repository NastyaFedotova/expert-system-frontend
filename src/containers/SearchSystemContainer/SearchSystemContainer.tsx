'use client';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/Button';
import Input from '@/components/Input';
import useSystemsPageStore from '@/store/systemsPageStore';
import useSystemsSearchParamsStore from '@/store/systemsSearchParamsStore';
import { TSystemResponseParams } from '@/types/systems';
import { classname } from '@/utils';

import classes from './SearchSystemContainer.module.scss';

const cnSearchSystem = classname(classes, 'searchSystemContainer');

type TSystemSearchForm = Omit<TSystemResponseParams, 'per_page' | 'page'>;

export const SearchSystemContainer: React.FC = () => {
  const setSearchParams = useSystemsSearchParamsStore((store) => store.setSearchParamsPage);
  const setCurrentPage = useSystemsPageStore((store) => store.setCurrentPage);
  const { register, handleSubmit } = useForm<TSystemSearchForm>();

  const submitButton = useCallback(
    (data: TSystemSearchForm) => {
      setSearchParams(data);
      setCurrentPage(1);
    },
    [setCurrentPage, setSearchParams],
  );

  return (
    <form onSubmit={handleSubmit(submitButton)} className={cnSearchSystem()}>
      <Input {...register('name')} placeholder="Название системы" className={cnSearchSystem('input')} />
      <Input {...register('username')} placeholder="Никнейм пользователя" className={cnSearchSystem('input')} />
      <Button>Поиск</Button>
    </form>
  );
};