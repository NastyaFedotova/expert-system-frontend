import { TQuestionUpdate, TQuestionWithAnswers, TQuestionWithAnswersNew } from '@/types/questions';

import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from '..';

export const getQuestionsWithAnswers = async (system_id: number): Promise<TQuestionWithAnswers[]> => {
  const { data } = await getApiRequest<TQuestionWithAnswers[]>(`/questions`, {
    params: { system_id },
  });

  return data.sort((a, b) => a.id - b.id);
};

export const createQuestionsWithAnswers = async (
  questions: TQuestionWithAnswersNew[],
): Promise<TQuestionWithAnswers[]> => {
  const { data } = await postApiRequest<TQuestionWithAnswers[], TQuestionWithAnswersNew[]>(`/questions`, questions);

  return data;
};

export const updateQuestions = async (questions: TQuestionUpdate[]): Promise<TQuestionWithAnswers[]> => {
  const { data } = await patchApiRequest<TQuestionWithAnswers[], TQuestionUpdate[]>(
    `/questions/multiple_patch`,
    questions,
  );

  return data;
};

export const deleteQuestions = async (questionsIds: number[]) => {
  const result = await deleteApiRequest(`/questions/multiple_delete`, questionsIds);

  return result;
};
