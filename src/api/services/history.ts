import { THistory, THistoryResponseParams } from '@/types/history';

import { getApiRequest } from '..';

export const getHistories = async (params?: THistoryResponseParams): Promise<THistory[]> => {
  const { data } = await getApiRequest<THistory[]>(`/histories`, {
    params,
  });

  return data;
};
