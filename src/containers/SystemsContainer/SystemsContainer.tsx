'use client';
import React, { memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSystems } from '@/api/services/systems';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import { SYSTEMS } from '@/constants';
import useSystemsPageStore from '@/store/systemsPageStore';
import useSystemsSearchParamsStore from '@/store/systemsSearchParamsStore';
import { classname, imageUrl } from '@/utils';

import classes from './SystemsContainer.module.scss';

const cnSystemsContainer = classname(classes, 'systemsContainer');

const SystemsContainer: React.FC = () => {
  const { currentPage, setPagesCount } = useSystemsPageStore((store) => store);
  const { name, username } = useSystemsSearchParamsStore((store) => store);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [SYSTEMS.GET, { page: currentPage, name, username }],
    queryFn: async () => await getSystems({ page: currentPage, name, username }),
  });

  useEffect(() => {
    if (data) {
      setPagesCount(data.pages);
    }
  }, [data, setPagesCount]);
  
  return (
    <div className={cnSystemsContainer()}>
      {data?.data.length &&
        isSuccess &&
        data.data.map((system) => (
          <Card key={system.id} image={imageUrl(system.image_uri)} title={system.name} subtitle={system.about} />
        ))}
      {isLoading && [...Array(20).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default memo(SystemsContainer);
