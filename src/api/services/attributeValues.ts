import { TAttributeValues, TAttributeValuesNew, TAttributeValuesUpdate } from '@/types/attributeValues';

import { deleteApiRequest, patchApiRequest, postApiRequest } from '..';

export const createAttributesValues = async (attrValues: TAttributeValuesNew[]): Promise<TAttributeValues[]> => {
  const { data } = await postApiRequest<TAttributeValues[], TAttributeValuesNew[]>(`/attributevalues`, attrValues);

  return data;
};

export const updateAttributesValues = async (attrValues: TAttributeValuesUpdate[]): Promise<TAttributeValues[]> => {
  const { data } = await patchApiRequest<TAttributeValues[], TAttributeValuesUpdate[]>(
    `/attributevalues/multiple_patch`,
    attrValues,
  );

  return data;
};

export const deleteAttributesValues = async (attrValuesIds: number[]) => {
  const result = await deleteApiRequest(`/attributevalues/multiple_delete`, attrValuesIds);

  return result;
};
