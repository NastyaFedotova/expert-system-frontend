import { TSystem, TSystemDeleteResponseParams, TSystemResponseParams, TSystemsWithPage } from '@/types/systems';

import { deleteApiRequest, getApiRequest } from '..';

export const getSystems = async (params?: TSystemResponseParams): Promise<TSystemsWithPage> => {
  const { data, headers } = await getApiRequest<TSystem[]>(`/systems`, {
    params,
  });

  return { systems: data, pages: +headers['x-pages'] };
};

export const deleteSystem = async (params: TSystemDeleteResponseParams) => {
  const { system_id, ...data } = params;
  const result = await deleteApiRequest(`/systems/${system_id}`, data);

  return result;
};
