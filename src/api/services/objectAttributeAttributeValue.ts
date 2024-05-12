import { TObjectAttributeAttributeValueNewValidation } from '@/types/objectAttributeAttributeValue';

import { deleteApiRequest, postApiRequest } from '..';

export const createObjectAttributeAttributeValueValidation = async (
  ids: TObjectAttributeAttributeValueNewValidation[],
) => {
  const { data } = await postApiRequest<unknown, TObjectAttributeAttributeValueNewValidation[]>(
    `/objects-attributevalues`,
    ids,
  );

  return data;
};

export const deleteObjectAttributeAttributeValueValidation = async (idsIds: number[]) => {
  const result = await deleteApiRequest(`/objects-attributevalues/multiple_delete`, idsIds);

  return result;
};
