'use client';
import React, { memo, useLayoutEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { getSystems } from '@/api/services/systems';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import Text, { TEXT_VIEW } from '@/components/Text';
import { SYSTEMS } from '@/constants';
import useSystemsSearchParamsStore from '@/store/systemsSearchParamsStore';
import { classname } from '@/utils';
import { mainPageSearchParamsParse } from '@/utils/searchParams';

import classes from './SystemsContainer.module.scss';

const cnSystemsContainer = classname(classes, 'systemsContainer');

const SystemsContainer: React.FC = () => {
  const searchParams = useSearchParams();
  const { currentPage, pagesCount, name, username, setSearchParamsPage } = useSystemsSearchParamsStore(
    (store) => store,
  );
  const validateParams = mainPageSearchParamsParse(searchParams);
  console.log(currentPage, pagesCount);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [
      SYSTEMS.GET,
      {
        page: currentPage,
        name,
        username,
      },
    ],
    queryFn: async () =>
      await getSystems({
        page: currentPage,
        name,
        username,
        per_page: 12,
      }),
  });

  useLayoutEffect(() => setSearchParamsPage({ ...validateParams, currentPage: validateParams.page }), []);

  return (
    <div className={cnSystemsContainer()}>
      {!!data?.systems.length &&
        isSuccess &&
        data.systems.map((system) => (
          <Card id={system.id} key={system.id} image={system.image_uri} title={system.name} subtitle={system.about} />
        ))}
      {currentPage > pagesCount && <Text view={TEXT_VIEW.p20}>Страница не найдена</Text>}
      {isLoading && [...Array(20).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default memo(SystemsContainer);
