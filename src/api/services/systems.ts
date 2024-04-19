import { TSystem, TSystemResponseParams } from '@/types/systems';

import { getApiRequest } from '..';

export const getSystems = async (params?: TSystemResponseParams) => {
  const { data, headers } = await getApiRequest<TSystem[]>(`/systems`, {
    params: { ...params },
  });

  return { data, pages: +headers['x-pages'] };
};
