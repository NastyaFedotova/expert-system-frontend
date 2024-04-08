import React from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getSystems } from '@/api/services/systems';
import { PageStepper } from '@/components/PageStepper';
import { SYSTEMS } from '@/constants';
import { ReposContainer } from '@/containers/RepositoriesContainer';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnAppPage = classname(classes, 'appPage');

export const Page = async (): Promise<React.JSX.Element> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [SYSTEMS.GET, { page: 1 }],
    queryFn: async () => await getSystems(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={cnAppPage()}>
        <ReposContainer />
        <PageStepper />
      </div>
    </HydrationBoundary>
  );
};

export default Page;
