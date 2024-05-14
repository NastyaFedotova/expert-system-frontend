import { TRuleQuestionAnswerNew } from '@/types/ruleQuestionAnswer';

import { deleteApiRequest, postApiRequest } from '..';

export const createRuleQuestionAnswer = async (ids: TRuleQuestionAnswerNew[]) => {
  const { data } = await postApiRequest<unknown, TRuleQuestionAnswerNew[]>(`/rule-question-answer`, ids);

  return data;
};

export const deleteRuleQuestionAnswer = async (idsIds: number[]) => {
  const result = await deleteApiRequest(`/rule-question-answer/multiple_delete`, idsIds);

  return result;
};
