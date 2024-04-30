'use client';
import { THistory, THistoryNormilize, THistoryResponseParams } from '@/types/history';

import { getApiRequest } from '..';

const getHistoriesNormilize = (data: THistory[]): THistoryNormilize[] =>
  data.map((history) => ({
    ...history,
    results: Object.entries(history.results)
      .map(([result, percent]) => ({ result, percent }))
      .toSorted((a, b) => b.percent - a.percent),
  }));

export const getHistories = async (params?: THistoryResponseParams): Promise<THistoryNormilize[]> => {
  const { data } = await getApiRequest<THistory[]>(`/histories`, {
    params,
  });
  return getHistoriesNormilize(data);
};
