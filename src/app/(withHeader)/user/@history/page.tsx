'use client'
import React, { memo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getHistories } from '@/api/services/history';
import { CardSkeleton } from '@/components/CardSkeleton';
import HistoryCard from '@/components/HistoryCard';
import { HISTORIES } from '@/constants';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnHistory = classname(classes, 'history');

const HistoryContainer: React.FC = () => {
  const user = useUserStore((store) => store.user);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [HISTORIES.GET, { user: user?.id }],
    queryFn: async () => await getHistories({ user: user?.id ?? -1 }),
    enabled: !!user,
  });

  return (
    <div className={cnHistory()}>
      {!!data?.length &&
        isSuccess &&
        data.map((system, index) => <HistoryCard key={index} {...system} title={system.system.name} />)}
      {isLoading && [...Array(6).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default memo(HistoryContainer);
