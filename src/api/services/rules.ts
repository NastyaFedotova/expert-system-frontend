import { TRule, TRuleNew } from '@/types/rules';

import { deleteApiRequest, getApiRequest, postApiRequest } from '..';

export const getRulesWithClausesAndEffects = async (system_id: number): Promise<TRule[]> => {
  const { data } = await getApiRequest<TRule[]>(`/rules`, {
    params: { system_id },
  });

  return data;
};

export const createRulesWithClausesAndEffects = async (answers: TRuleNew[]): Promise<TRule[]> => {
  const { data } = await postApiRequest<TRule[], TRuleNew[]>(`/rules`, answers);

  return data;
};

export const deleteRules = async (answersIds: number[]) => {
  const result = await deleteApiRequest(`/rules/multiple_delete`, answersIds);

  return result;
};
