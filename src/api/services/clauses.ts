import { TClause, TClauseNew, TClauseUpdate } from '@/types/clauses';

import { deleteApiRequest, patchApiRequest, postApiRequest } from '..';

export const createClauses = async (clauses: TClauseNew[]): Promise<TClause[]> => {
  const { data } = await postApiRequest<TClause[], TClauseNew[]>(`/clauses`, clauses);

  return data;
};

export const updateClauses = async (clauses: TClauseUpdate[]): Promise<TClause[]> => {
  const { data } = await patchApiRequest<TClause[], TClauseUpdate[]>(`/clauses/multiple_patch`, clauses);

  return data;
};

export const deleteClauses = async (clausesIds: number[]) => {
  const result = await deleteApiRequest(`/clauses/multiple_delete`, clausesIds);

  return result;
};
