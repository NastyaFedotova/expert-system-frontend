'use client';
import React, { memo, useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Text, { TEXT_VIEW } from '@/components/Text';
import { classname } from '@/utils';

import classes from './layout.module.scss';

const cnUserPage = classname(classes, 'userPage-layout');

enum Section {
  PROFILE = 'profile',
  CREATED_SYSTEMS = 'systems',
  HISTORY = 'history',
}

const getSection = (param: string | null): Section => {
  switch (param) {
    case 'systems':
      return Section.CREATED_SYSTEMS;
    case 'history':
      return Section.HISTORY;
    default:
      return Section.PROFILE;
  }
};

type UserPageLayoutProps = {
  profile: React.ReactNode;
  systems: React.ReactNode;
  history: React.ReactNode;
};

const UserPageLayout: React.FC<UserPageLayoutProps> = ({ profile, systems, history }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [section, setSection] = useState<Section>(getSection(searchParams.get('section')));

  useLayoutEffect(() => {
    if (section !== Section.PROFILE) {
      router.prefetch(`/user?section=${Section.PROFILE}`);
    }
    if (section !== Section.CREATED_SYSTEMS) {
      router.prefetch(`/user?section=${Section.CREATED_SYSTEMS}`);
    }
    if (section !== Section.HISTORY) {
      router.prefetch(`/user?section=${Section.HISTORY}`);
    }
  }, [router, section]);

  const sectionChoice = useCallback(
    (chptr: Section) => () => {
      router.replace(`/user?section=${chptr}`);
      setSection(chptr);
    },
    [router],
  );

  const memoSection = useMemo(() => {
    switch (section) {
      case Section.CREATED_SYSTEMS:
        return systems;
      case Section.HISTORY:
        return history;
      default:
        return profile;
    }
  }, [history, profile, section, systems]);

  return (
    <div className={cnUserPage()}>
      <header className={cnUserPage('header')}>
        <Text
          onClick={sectionChoice(Section.PROFILE)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('section', { selected: section === Section.PROFILE })}
        >
          Профиль
        </Text>
        <Text
          onClick={sectionChoice(Section.CREATED_SYSTEMS)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('section', { selected: section === Section.CREATED_SYSTEMS })}
        >
          Созданные системы
        </Text>
        <Text
          onClick={sectionChoice(Section.HISTORY)}
          view={TEXT_VIEW.p18}
          className={cnUserPage('section', { selected: section === Section.HISTORY })}
        >
          История
        </Text>
      </header>
      {memoSection}
    </div>
  );
};

export default memo(UserPageLayout);
