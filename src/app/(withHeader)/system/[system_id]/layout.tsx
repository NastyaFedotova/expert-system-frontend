'use client';
import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notFound, useRouter, useSearchParams } from 'next/navigation';

import Text, { TEXT_VIEW } from '@/components/Text';
import { SYSTEMS } from '@/constants';
import useSystemStore from '@/store/systemStore';
import useUserStore from '@/store/userStore';
import { TSystemsWithPage } from '@/types/systems';
import { classname } from '@/types/utils';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './layout.module.scss';

const cnMainLayout = classname(classes, 'system-editor-layout');

enum Section {
  SYSTEM = 'system',
  ATTRIBUTES = 'attributes',
  OBJECTS = 'objects',
  QUESTIONS = 'questions',
  RULES = 'rules',
}

const getSection = (param: string | null): Section => {
  switch (param) {
    case 'attributes':
      return Section.ATTRIBUTES;
    case 'objects':
      return Section.OBJECTS;
    case 'questions':
      return Section.QUESTIONS;
    case 'rules':
      return Section.RULES;
    default:
      return Section.SYSTEM;
  }
};

type SystemEditorPageLayoutProps = {
  system: React.ReactNode;
  attributes: React.ReactNode;
  objects: React.ReactNode;
  questions: React.ReactNode;
  rules: React.ReactNode;
  params: { system_id: number };
};

const Layout: React.FC<SystemEditorPageLayoutProps> = ({ system, attributes, objects, questions, rules, params }) => {
  const router = useRouter();
  const user = useUserStore((store) => store.user);
  const getSystem = useSystemStore((store) => store.getSystem);
  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);
  const queryClient = useQueryClient();
  const { status } = useQuery({
    queryKey: [SYSTEMS.RETRIEVE, { user_id: user?.id, system_id }],
    queryFn: async () => await getSystem(system_id),
    initialData: () =>
      queryClient
        .getQueryData<TSystemsWithPage>([SYSTEMS.GET_USER, { user_id: user?.id, all_types: true }])
        ?.systems.find((system) => system.id === system_id),
  });
  useEffect(() => {
    if (status === 'error') {
      notFound();
    }
  }, [status]);

  const searchParams = useSearchParams();
  const [section, setSection] = useState<Section>(getSection(searchParams.get('section')));

  useLayoutEffect(() => {
    if (section !== Section.SYSTEM) {
      router.prefetch(`/system/${system_id}?section=${Section.SYSTEM}`);
    }
    if (section !== Section.ATTRIBUTES) {
      router.prefetch(`/system/${system_id}?section=${Section.ATTRIBUTES}`);
    }
    if (section !== Section.OBJECTS) {
      router.prefetch(`/system/${system_id}?section=${Section.OBJECTS}`);
    }
    if (section !== Section.QUESTIONS) {
      router.prefetch(`/system/${system_id}?section=${Section.QUESTIONS}`);
    }
    if (section !== Section.RULES) {
      router.prefetch(`/system/${system_id}?section=${Section.RULES}`);
    }
  }, [router, section, system_id]);

  const sectionSelect = useCallback(
    (chptr: Section) => () => {
      router.replace(`/system/${system_id}?section=${chptr}`);
      setSection(chptr);
    },
    [router, system_id],
  );

  const memoSectoion = useMemo(() => {
    switch (section) {
      case Section.ATTRIBUTES:
        return attributes;
      case Section.OBJECTS:
        return objects;
      case Section.QUESTIONS:
        return questions;
      case Section.RULES:
        return rules;
      default:
        return system;
    }
  }, [attributes, objects, questions, rules, section, system]);

  return (
    <div className={cnMainLayout()}>
      <header className={cnMainLayout('header')}>
        <Text
          onClick={sectionSelect(Section.SYSTEM)}
          view={TEXT_VIEW.p18}
          className={cnMainLayout('section', { selected: section === Section.SYSTEM })}
        >
          О системе
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
