'use client';
import React, { memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import Text, { TEXT_VIEW } from '@/components/Text';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';
import { systemIdValidation } from '@/validation/searchParams';

import classes from './page.module.scss';

const cnSystemCreatePage = classname(classes, 'systemTestPage');

type SystemTestPageProps = {
  params: { system_id: number };
};

const Page: React.FC<SystemTestPageProps> = ({ params }) => {
  const router = useRouter();
  const user = useUserStore((store) => store.user);
  const system_id = useMemo(() => systemIdValidation.safeParse(params).data?.system_id ?? -1, [params]);
  console.log(router, user, system_id);
  return (
    <div className={cnSystemCreatePage()}>
      <header className={cnSystemCreatePage('header')}>
        <Text view={TEXT_VIEW.title} className={cnSystemCreatePage('title')}>
          Создание новой системы
        </Text>
      </header>
      <main>
        <form className={cnSystemCreatePage('form')}>
          <Button className={cnSystemCreatePage('button')}>Cоздать систему</Button>
        </form>
      </main>
    </div>
  );
};

export default memo(Page);
