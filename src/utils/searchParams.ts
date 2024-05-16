import { ReadonlyURLSearchParams } from 'next/navigation';

import { mainPageValidation } from '@/validation/searchParams';

export type TMainPageSearchParams = {
  page?: number;
  name?: string;
  username?: string;
};
export const mainPageSearchParamsParse = (params: ReadonlyURLSearchParams): TMainPageSearchParams => {
  const validateParams = mainPageValidation.safeParse({
    page: params.get('page'),
    name: params.get('name'),
    username: params.get('username'),
  });

  return {
    page: validateParams.data?.page ?? undefined,
    name: validateParams.data?.name ?? undefined,
    username: validateParams.data?.username ?? undefined,
  };
};
