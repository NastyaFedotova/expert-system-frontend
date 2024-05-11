import { TQuestionsUpdate, TQuestionsWithAnswers, TQuestionsWithAnswersNew } from '@/types/questions';

import { deleteApiRequest, getApiRequest, patchApiRequest, postApiRequest } from '..';

export const getQuestionsWithAnswers = async (system_id: number): Promise<TQuestionsWithAnswers[]> => {
  const { data } = await getApiRequest<TQuestionsWithAnswers[]>(`/questions`, {
    params: { system_id },
  });

  return data.sort((a, b) => a.id - b.id);
};

export const createQuestionsWithAnswers = async (
  questions: TQuestionsWithAnswersNew[],
): Promise<TQuestionsWithAnswers[]> => {
  const { data } = await postApiRequest<TQuestionsWithAnswers[], TQuestionsWithAnswersNew[]>(`/questions`, questions);

  return data;
};

export const updateQuestions = async (questions: TQuestionsUpdate[]): Promise<TQuestionsWithAnswers[]> => {
  const { data } = await patchApiRequest<TQuestionsWithAnswers[], TQuestionsUpdate[]>(
    `/questions/multiple_patch`,
    questions,
  );

  return data;
};

export const deleteQuestions = async (questionsIds: number[]) => {
  const result = await deleteApiRequest(`/questions/multiple_delete`, questionsIds);

  return result;
};
