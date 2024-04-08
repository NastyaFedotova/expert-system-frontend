'use client';
import { useQuery } from '@tanstack/react-query';

import { TSystem, TSystemResponseParams } from '@/types/systems';

import { getSystems } from '../services/systems';

export const useGetSystems = (params?: TSystemResponseParams, initialData?: TSystem[]) => {
  return useQuery({
    queryKey: ['posts', { ...params }],
    queryFn: async () => {
      const response = await getSystems(params);
      return response.data;
    },
    initialData,
  });
};
