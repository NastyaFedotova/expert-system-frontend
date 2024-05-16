import React from 'react';

import { Header } from '@/components/Header';
import { classname } from '@/utils';

import classes from './layout.module.scss';

const cnMainLayout = classname(classes, 'withHeaderLayout');

const WithHeaderLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      <main className={cnMainLayout('main-area')}>
        <span className={cnMainLayout('top-gradient')} />
        {children}
        <span className={cnMainLayout('bottom-gradient')} />
      </main>
    </>
  );
};

export default WithHeaderLayout;
