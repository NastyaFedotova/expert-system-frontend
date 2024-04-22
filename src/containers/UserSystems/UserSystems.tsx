import React, { memo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getSystems } from '@/api/services/systems';
import { Card } from '@/components/Card';
import { CardSkeleton } from '@/components/CardSkeleton';
import { SYSTEMS } from '@/constants';
import useUserStore from '@/store/userStore';
import { classname, imageUrl } from '@/utils';

import classes from './UserSystems.module.scss';

const cnUserProfile = classname(classes, 'user-systems');

export const UserSystems: React.FC = () => {
  const { user } = useUserStore((store) => store);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [SYSTEMS.GET_USER, { user_id: user?.id }],
    queryFn: async () => await getSystems({ user_id: user?.id }),
  });

  const handleEdit = useCallback((id: number) => console.log('system to edit: ', id), []);
  const handleClick = useCallback((id: number) => () => console.log('system click: ', id), []);
  const handleDelete = useCallback((id: number) => console.log('system to delete: ', id), []);

  return (
    <div className={cnUserProfile()}>
      {data?.data.length &&
        isSuccess &&
        data.data.map((system) => (
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
