import { TAnswer, TAnswerNew, TAnswerUpdate } from '@/types/answers';

import { deleteApiRequest, patchApiRequest, postApiRequest } from '..';

export const createAnswers = async (answers: TAnswerNew[]): Promise<TAnswer[]> => {
  const { data } = await postApiRequest<TAnswer[], TAnswerNew[]>(`/answers`, answers);

  return data;
};

export const updateAnswers = async (answers: TAnswerUpdate[]): Promise<TAnswer[]> => {
  const { data } = await patchApiRequest<TAnswer[], TAnswerUpdate[]>(`/answers/multiple_patch`, answers);

  return data;
};

export const deleteAnswers = async (answersIds: number[]) => {
  const result = await deleteApiRequest(`/answers/multiple_delete`, answersIds);

  return result;
};
