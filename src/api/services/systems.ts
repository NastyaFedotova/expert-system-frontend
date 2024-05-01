import {
  TSystem,
  TSystemDeleteResponseParams,
  TSystemNew,
  TSystemRequestParams,
  TSystemsWithPage,
} from '@/types/systems';

import { deleteApiRequest, getApiRequest, postApiRequest } from '..';

export const getSystems = async (params?: TSystemRequestParams): Promise<TSystemsWithPage> => {
  const { data, headers } = await getApiRequest<TSystem[]>(`/systems`, {
    params,
  });

  return { systems: data.toSorted((a, b) => b.id - a.id), pages: +headers['x-pages'] };
};

export const deleteSystem = async (params: TSystemDeleteResponseParams) => {
  const { system_id, ...data } = params;
  const result = await deleteApiRequest(`/systems/${system_id}`, data);

  return result;
};

export const createSystem = async (params: TSystemNew) => {
  const data = new FormData();
  data.append('name', params.name);
  data.append('private', String(params.private));
  const image = params.image?.item(0);
  if (image) {
    data.append('image', image);
  }
  const about = params.about;
  if (about) {
    data.append('about', about);
  }

  const result = await postApiRequest<TSystem, FormData>(`/systems`, data);

  return result;
};
