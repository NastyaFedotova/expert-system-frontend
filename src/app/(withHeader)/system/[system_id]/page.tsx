'use client';
import { memo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getSystemOne } from '@/api/services/systems';
import { SYSTEMS } from '@/constants';
import useUserStore from '@/store/userStore';
import { TSystemsWithPage } from '@/types/systems';

const Page = ({ params }: { params: { system_id?: number } }) => {
  const queryClient = useQueryClient();
  const user = useUserStore((store) => store.user);

  const { data } = useQuery({
    queryKey: [SYSTEMS.RETRIEVE, { user_id: user?.id, system_id: Number(params.system_id) }],
    queryFn: async () => await getSystemOne(params.system_id ?? -1),
    initialData: () =>
      queryClient
        .getQueryData<TSystemsWithPage>([SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }])
        ?.systems.find((system) => system.id === Number(params.system_id)),
    enabled: !!user && !!params.system_id,
  });

  return <h1>{JSON.stringify(data) ?? 'new system'}</h1>;
};

export default memo(Page);
