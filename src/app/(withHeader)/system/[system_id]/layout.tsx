'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';

import Text, { TEXT_VIEW } from '@/components/Text';
import { classname } from '@/utils';

import classes from './layout.module.scss';

enum Section {
  SYSTEM = 'system',
  ATTRIBUTES = 'attributes',
  OBJECTS = 'objects',
  QUESTIONS = 'questions',
  RULES = 'rules',
}

const cnMainLayout = classname(classes, 'system-editor-layout');

const Layout = ({ system }: { system: React.ReactNode }) => {
  const [section, setSection] = useState<Section>(Section.SYSTEM);

  const sectionSelect = useCallback(
    (chptr: Section) => () => {
      setSection(chptr);
    },
    [],
  );

  const memoSectoion = useMemo(() => {
    switch (section) {
      case Section.ATTRIBUTES:
        return <>атрибуты</>;
      case Section.OBJECTS:
        return <>objects</>;
      case Section.QUESTIONS:
        return <>questions</>;
      case Section.RULES:
        return <>rules</>;
      default:
        return system;
    }
  }, [section, system]);

  return (
    <div className={cnMainLayout()}>
      <header className={cnMainLayout('header')}>
        <Text
          onClick={sectionSelect(Section.SYSTEM)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.SYSTEM })}
        >
          Система
        </Text>
        <Text
          onClick={sectionSelect(Section.ATTRIBUTES)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.ATTRIBUTES })}
        >
          Атрибуты
        </Text>
        <Text
          onClick={sectionSelect(Section.OBJECTS)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.OBJECTS })}
        >
          Обьекты
        </Text>
        <Text
          onClick={sectionSelect(Section.QUESTIONS)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.QUESTIONS })}
        >
          Вопросы
        </Text>
        <Text
          onClick={sectionSelect(Section.RULES)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.RULES })}
        >
          Правила
        </Text>
      </header>
      {memoSectoion}
    </div>
  );
};

export default memo(Layout);
