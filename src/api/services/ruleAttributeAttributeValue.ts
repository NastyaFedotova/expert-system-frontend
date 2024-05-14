import { TRuleAttributeAttributeValueNew } from '@/types/ruleAttributeAttributeValue';

import { deleteApiRequest, postApiRequest } from '..';

export const createRuleAttributeAttributeValue = async (ids: TRuleAttributeAttributeValueNew[]) => {
  const { data } = await postApiRequest<unknown, TRuleAttributeAttributeValueNew[]>(
    `/rule-attribute-attributevalue`,
    ids,
  );

  return data;
};

export const deleteRuleAttributeAttributeValue = async (idsIds: number[]) => {
  const result = await deleteApiRequest(`/rule-attribute-attributevalue/multiple_delete`, idsIds);

  return result;
};
