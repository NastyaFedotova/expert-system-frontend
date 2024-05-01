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

export const getSystemOne = async (system_id: number): Promise<TSystem> => {
  const { data } = await getApiRequest<TSystem>(`/systems/${system_id}`);

  return data;
};

export const deleteSystem = async (params: TSystemDeleteResponseParams) => {
  const { system_id, ...data } = params;
  const result = await deleteApiRequest(`/systems/${system_id}`, data);

  return result;
};

export const createSystem = async (params: TSystemNew) => {
  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('private', String(params.private));
  const image = params.image?.item(0);
  if (image) {
    formData.append('image', image);
  }
  const about = params.about;
  if (about) {
    formData.append('about', about);
  }

  const { data } = await postApiRequest<TSystem, FormData>(`/systems`, formData);

  return data;
};
