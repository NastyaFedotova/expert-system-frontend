import { TObjectUpdate, TObjectWithIds, TObjectWithIdsNew } from '@/types/objects';

import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from '..';

export const getObjectsWithAttrValues = async (system_id: number): Promise<TObjectWithIds[]> => {
  const { data } = await getApiRequest<TObjectWithIds[]>(`/objects`, {
    params: { system_id },
  });

  return data.sort((a, b) => a.id - b.id);
};

export const createObjectWithAttrValues = async (objects: TObjectWithIdsNew[]): Promise<TObjectWithIds[]> => {
  const { data } = await postApiRequest<TObjectWithIds[], TObjectWithIdsNew[]>(`/objects`, objects);

  return data;
};

export const updateObjects = async (objects: TObjectUpdate[]): Promise<TObjectWithIds[]> => {
  const { data } = await patchApiRequest<TObjectWithIds[], TObjectUpdate[]>(`/objects/multiple_patch`, objects);

  return data;
};

export const deleteObjects = async (objectsIds: number[]) => {
  const result = await deleteApiRequest(`/objects/multiple_delete`, objectsIds);

  return result;
};
