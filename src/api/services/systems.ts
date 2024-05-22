import moment from 'moment';

import {
  TSystem,
  TSystemDeleteResponseParams,
  TSystemNew,
  TSystemRequestParams,
  TSystemsWithPage,
  TSystemTest,
  TSystemUpdate,
} from '@/types/systems';

import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from '..';

export const getSystems = async (params?: TSystemRequestParams): Promise<TSystemsWithPage> => {
  const { data, headers } = await getApiRequest<TSystem[]>(`/systems`, {
    params,
  });

  return {
    systems: data.toSorted((a, b) => (moment(b.updated_at).isAfter(a.updated_at) ? 1 : -1)),
    pages: +headers['x-pages'],
  };
};

export const getSystemOne = async (system_id: number): Promise<TSystem> => {
  const { data } = await getApiRequest<TSystem>(`/systems/${system_id}`);

  return data;
};

export const getSystemBackupUrl = async (system_id: number, systemName?: string): Promise<string> => {
  const { data } = await getApiRequest<number[]>(`/systems/${system_id}/backup`);
  const name = systemName ? systemName + '.isbes' : 'backup.isbes';
  const file = new File([data.join(' ')], name, { type: 'text/plain' });
  return URL.createObjectURL(file);
};

export const postSystemRestore = async (systemVec: number[]) => {
  const { data } = await postApiRequest<TSystem, number[]>(`/systems/restore`, systemVec);
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
  const image = params.image;
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

export const updateSystem = async (params: TSystemUpdate & { system_id: number }) => {
  const { system_id, ...responseParams } = params;
  const formData = new FormData();

  type paramsKeys = keyof TSystemUpdate;

  Object.keys(responseParams).forEach((key) => {
    const param = key as paramsKeys;
    if (param === 'image') {
      const image = responseParams[param];
      if (image) {
        formData.append('image', image);
      }
    } else {
      formData.append(String(param), String(responseParams[param]));
    }
  });

  const { data } = await patchApiRequest<TSystem, FormData>(`/systems/${system_id}`, formData);

  return data;
};

export const getSystemTest = async (system_id: number): Promise<TSystemTest> => {
  const { data } = await getApiRequest<TSystemTest>(`/systems/${system_id}/test`);

  return data;
};
