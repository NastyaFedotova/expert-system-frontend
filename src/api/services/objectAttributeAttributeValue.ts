import { TObjectAttributeAttributeValueNew } from '@/types/objectAttributeAttributeValue';

import { deleteApiRequest, postApiRequest } from '..';

export const createObjectAttributeAttributeValue = async (ids: TObjectAttributeAttributeValueNew[]) => {
  const { data } = await postApiRequest<unknown, TObjectAttributeAttributeValueNew[]>(
    `/object-attribute-attributevalue`,
    ids,
  );

  return data;
};

export const deleteObjectAttributeAttributeValue = async (idsIds: number[]) => {
  const result = await deleteApiRequest(`/object-attribute-attributevalue/multiple_delete`, idsIds);

  return result;
};
