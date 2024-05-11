import { TAttributeUpdate, TAttributeWithAttributeValues, TAttributeWithAttributeValuesNew } from '@/types/attributes';

import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from '..';

export const getAttributesWithValues = async (system_id: number): Promise<TAttributeWithAttributeValues[]> => {
  const { data } = await getApiRequest<TAttributeWithAttributeValues[]>(`/attributes`, {
    params: { system_id },
  });

  return data.sort((a, b) => a.id - b.id);
};

export const createAttributesWithValues = async (
  attr: TAttributeWithAttributeValuesNew[],
): Promise<TAttributeWithAttributeValues[]> => {
  const { data } = await postApiRequest<TAttributeWithAttributeValues[], TAttributeWithAttributeValuesNew[]>(
    `/attributes`,
    attr,
  );

  return data;
};

export const updateAttributes = async (attr: TAttributeUpdate[]): Promise<TAttributeWithAttributeValues[]> => {
  const { data } = await patchApiRequest<TAttributeWithAttributeValues[], TAttributeUpdate[]>(
    `/attributes/multiple_patch`,
    attr,
  );

  return data;
};

export const deleteAttributes = async (attrIds: number[]) => {
  const result = await deleteApiRequest(`/attributes/multiple_delete`, attrIds);

  return result;
};
