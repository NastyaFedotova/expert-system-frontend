'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';

import Text, { TEXT_VIEW } from '@/components/Text';
import Profile from '@/containers/Profile';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnUserPage = classname(classes, 'userPage');

enum Chapter {
  Profile = 'Profile',
  CREATED_SYSTEMS = ' createdSystems',
  HISTORY = 'history',
}

export const Page: React.FC = () => {
  const [chapter, setChapter] = useState<Chapter>(Chapter.Profile);

  const chapterChoice = useCallback((chptr: Chapter) => () => setChapter(chptr), []);

  const memoChapter = useMemo(() => {
    switch (chapter) {
      case Chapter.CREATED_SYSTEMS:
        return <div>Созданные системы</div>;
      case Chapter.HISTORY:
        return <div>Истотрия</div>;
      default:
        return <Profile />;
    }
  }, [chapter]);

  return (
    <div className={cnUserPage()}>
      <header className={cnUserPage('header')}>
        <Text
          onClick={chapterChoice(Chapter.Profile)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('chapter', { selected: chapter === Chapter.Profile })}
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
