'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Text, { TEXT_VIEW } from '@/components/Text';
import HistoryContainer from '@/containers/HistoryContainer';
import Profile from '@/containers/Profile';
import { UserSystems } from '@/containers/UserSystems';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnUserPage = classname(classes, 'userPage');

enum Chapter {
  PROFILE = 'profile',
  CREATED_SYSTEMS = 'systems',
  HISTORY = 'history',
}

const getSection = (param: string | null): Chapter => {
  switch (param) {
    case 'systems':
      return Chapter.CREATED_SYSTEMS;
    case 'history':
      return Chapter.HISTORY;
    default:
      return Chapter.PROFILE;
  }
};

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter>(getSection(searchParams.get('section')));

  const chapterChoice = useCallback(
    (chptr: Chapter) => () => {
      router.replace(`/user?section=${chptr}`);
      setChapter(chptr);
    },
    [router],
  );

  const memoChapter = useMemo(() => {
    switch (chapter) {
      case Chapter.CREATED_SYSTEMS:
        return <UserSystems />;
      case Chapter.HISTORY:
        return <HistoryContainer />;
      default:
        return <Profile />;
    }
  }, [chapter]);

  return (
    <div className={cnUserPage()}>
      <header className={cnUserPage('header')}>
        <Text
          onClick={chapterChoice(Chapter.PROFILE)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('chapter', { selected: chapter === Chapter.PROFILE })}
        >
          Профиль
        </Text>
        <Text
          onClick={chapterChoice(Chapter.CREATED_SYSTEMS)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('chapter', { selected: chapter === Chapter.CREATED_SYSTEMS })}
        >
          Созданные системы
        </Text>
        <Text
          onClick={chapterChoice(Chapter.HISTORY)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('chapter', { selected: chapter === Chapter.HISTORY })}
        >
          Истотрия
        </Text>
      </header>
      {memoChapter}
    </div>
  );
};

export default memo(Page);
