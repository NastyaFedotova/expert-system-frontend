import { TAnswers, TAnswersNew, TAnswersUpdate } from '@/types/answers';

import { deleteApiRequest, patchApiRequest, postApiRequest } from '..';

export const createAnswers = async (answers: TAnswersNew[]): Promise<TAnswers[]> => {
  const { data } = await postApiRequest<TAnswers[], TAnswersNew[]>(`/answers`, answers);

  return data;
};

export const updateAnswers = async (answers: TAnswersUpdate[]): Promise<TAnswers[]> => {
  const { data } = await patchApiRequest<TAnswers[], TAnswersUpdate[]>(`/answers/multiple_patch`, answers);

  return data;
};

export const deleteAnswers = async (answersIds: number[]) => {
  const result = await deleteApiRequest(`/answers/multiple_delete`, answersIds);

  return result;
};
