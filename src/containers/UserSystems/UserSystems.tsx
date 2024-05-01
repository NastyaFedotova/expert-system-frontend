import React, { memo, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { deleteSystem, getSystems } from '@/api/services/systems';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import { SYSTEMS } from '@/constants';
import useUserStore from '@/store/userStore';
import { TSystemsWithPage } from '@/types/systems';
import { classname, imageUrl } from '@/utils';

import classes from './UserSystems.module.scss';

const cnUserProfile = classname(classes, 'user-systems');

export const UserSystems: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore((store) => store);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
    queryFn: async () => await getSystems({ user_id: user?.id, all_types: true }),
    enabled: !!user,
  });

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: deleteSystem,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }] });
      const previousTodos = queryClient.getQueryData<TSystemsWithPage>([
        SYSTEMS.GET_USER,
        { user_id: user?.id, all_types: true },
      ]);
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        (old?: TSystemsWithPage) => ({
          pages: old?.pages ?? 1,
          systems: old?.systems.filter((system) => system.id !== data.system_id) ?? [],
        }),
      );
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData<TSystemsWithPage>(
        [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }],
        context?.previousTodos,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }] });
    },
  });

  const handleEdit = useCallback((id: number) => console.log('system to edit: ', id), []);
  const handleClick = useCallback((id: number) => () => router.push(`/system/${id}`), [router]);
  const handleDelete = useCallback(
    (id: number, password: string) => {
      console.log('system to delete: ', id, ' ', password);
      mutate.mutate({ system_id: id, password });
    },
    [mutate],
  );

  return (
    <div className={cnUserProfile()}>
      {data?.systems.length &&
        isSuccess &&
        data.systems.map((system) => (
          <Card
            key={system.id}
            id={system.id}
            image={imageUrl(system.image_uri)}
            title={system.name}
            subtitle={system.about}
            canEdit
            onEditClick={handleEdit}
            canDelete
            onDeleteClick={handleDelete}
            onClick={handleClick(system.id)}
          />
        ))}
      {isLoading && [...Array(6).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default memo(UserSystems);
