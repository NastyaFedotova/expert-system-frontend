'use client';
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSystems } from '@/api/services/systems';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import { SYSTEMS } from '@/constants';
import { useReposPageStore } from '@/providers/storeProvider';
import { TSystem } from '@/types/systems';
import { classname, imageUrl } from '@/utils';

import classes from './RepositoriesContainer.module.scss';

const cnOrgRepositoriesContainer = classname(classes, 'repositoriesContainer');

export type RepositoriesContainerProps = {
  systems: TSystem[];
};

const RepositoriesContainer: React.FC = () => {
  const { currentPage, setPagesCount } = useReposPageStore((store) => store);
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [SYSTEMS.GET, { page: currentPage }],
    queryFn: async () => await getSystems({ page: currentPage }),
  });

  useEffect(() => {
    if (data) {
      setPagesCount(data.pages);
    }
  }, []);
  return (
    <div className={cnOrgRepositoriesContainer()}>
      {data?.data.length &&
        isSuccess &&
        data.data.map((system) => (
          <Card key={system.id} image={imageUrl(system.image_uri)} title={system.name} subtitle={system.about} />
        ))}
      {isLoading && [...Array(20).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default RepositoriesContainer;
