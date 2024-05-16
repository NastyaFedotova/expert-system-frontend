import React, { Suspense } from 'react';
import moment from 'moment';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/providers';
import { classname } from '@/types/utils';

import './global.scss';
import classes from './layout.module.scss';

const cnMainLayout = classname(classes, 'mainLayout');

const inter = Inter({ subsets: ['cyrillic'] });

export const metadata: Metadata = {
  title: 'ИПО ПЭС',
  description: 'Инструментальное программного обеспечение для построения экспертных систем',
};

moment.locale('ru');

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ru" className={inter.className}>
      <body className={cnMainLayout()}>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
};

export default RootLayout;
