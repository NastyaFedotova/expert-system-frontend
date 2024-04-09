'use client';
import React from 'react';

import Text, { TEXT_TAG, TEXT_VIEW } from '@/components/Text';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnUserPage = classname(classes, 'userPage');

export const Page = () => {
  return (
    <div className={cnUserPage()}>
      <Text tag={TEXT_TAG.h1} view={TEXT_VIEW.title}>
        Личный кабинет
      </Text>
    </div>
  );
};

export default Page;
