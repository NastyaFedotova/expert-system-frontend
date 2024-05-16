'use client';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  const pathname = usePathname();
  const router = useRouter();
  const { setSearchName, setSearchUsername, setCurrentPage } = useSystemsSearchParamsStore((store) => store);
  const validateParams = useMemo(() => mainPageSearchParamsParse(searchParams), [searchParams]);
  const { register, handleSubmit, watch } = useForm<TSystemSearchForm>({
    defaultValues: { name: validateParams.name, username: validateParams.username },
  });

  const submitButton = useCallback(
    (data: TSystemSearchForm) => {
      const newSearchParams = new URLSearchParams({ page: '1' });
      if (data.name?.length) {
        newSearchParams.set('name', data.name);
        setSearchName(data.name);
      }
      if (data.username?.length) {
        newSearchParams.set('username', data.username);
        setSearchUsername(data.username);
      }
      router.replace(`${pathname}?${newSearchParams.toString()}`);
      setCurrentPage(1);
    },
    [pathname, router, setCurrentPage, setSearchName, setSearchUsername],
  );

  const formWatch = watch();

  return (
    <form onSubmit={handleSubmit(submitButton)} className={cnSearchSystem()}>
      <Input
        {...register('name')}
        placeholder="Название системы"
        label={formWatch.name?.length ? 'Название' : undefined}
        className={cnSearchSystem('input')}
      />
      <Input
        {...register('username')}
        placeholder="Никнейм пользователя"
        label={formWatch.username?.length ? 'Никнейм' : undefined}
        className={cnSearchSystem('input')}
      />
      <Button>Поиск</Button>
    </form>
  );
};
