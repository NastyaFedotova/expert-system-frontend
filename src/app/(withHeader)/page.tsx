import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getSystems } from '@/api/services/systems';
import { PageStepper } from '@/components/PageStepper';
import { SYSTEMS } from '@/constants';
import { SearchSystemContainer } from '@/containers/SearchSystemContainer';
import { ReposContainer } from '@/containers/SystemsContainer';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnAppPage = classname(classes, 'appPage');

const Page: React.FC = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [SYSTEMS.GET, { page: 1 }],
    queryFn: async () => await getSystems({ per_page: 2 }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cnAppPage()}>
        <SearchSystemContainer />
        <ReposContainer />
        <PageStepper />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
