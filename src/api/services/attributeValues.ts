import { TAttributeValue, TAttributeValueNew, TAttributeValueUpdate } from '@/types/attributeValues';

import { deleteApiRequest, patchApiRequest, postApiRequest } from '..';

export const createAttributesValues = async (attrValues: TAttributeValueNew[]): Promise<TAttributeValue[]> => {
  const { data } = await postApiRequest<TAttributeValue[], TAttributeValueNew[]>(`/attributevalues`, attrValues);

  return data;
};

export const updateAttributesValues = async (attrValues: TAttributeValueUpdate[]): Promise<TAttributeValue[]> => {
  const { data } = await patchApiRequest<TAttributeValue[], TAttributeValueUpdate[]>(
    `/attributevalues/multiple_patch`,
    attrValues,
  );

  return data;
};

export const deleteAttributesValues = async (attrValuesIds: number[]) => {
  const result = await deleteApiRequest(`/attributevalues/multiple_delete`, attrValuesIds);

  return result;
};
