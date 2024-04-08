import { QueryClient } from '@tanstack/react-query';

import { TSystem, TSystemResponseParams } from '@/types/systems';

import { getApiRequest } from '..';

export const getSystems = async (params?: TSystemResponseParams) => {
  const { data, headers } = await getApiRequest<TSystem[]>(`/systems`, {
    params: { ...params, per_page: 2 },
  });

  return { data, pages: +headers['pages'] };
};

export const useGetSystemsPrefetch = async (params?: TSystemResponseParams, initialData?: TSystem[]) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['posts', { ...params }],
    queryFn: async () => {
      const response = await getSystems(params);
      return response.data;
    },
    initialData,
  });

  return queryClient;
};
