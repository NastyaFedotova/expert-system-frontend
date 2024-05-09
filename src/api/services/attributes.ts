import { TAttributeWithAttributeValues } from '@/types/attributes';

import { getApiRequest } from '..';

export const getAttributesWithValues = async (system_id: number): Promise<TAttributeWithAttributeValues[]> => {
  const { data } = await getApiRequest<TAttributeWithAttributeValues[]>(`/attributes`, {
    params: { system_id },
  });

  return data;
};
