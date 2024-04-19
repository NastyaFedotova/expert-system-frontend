import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/providers';
import { classname } from '@/utils';

import classes from './layout.module.scss';

const cnMainLayout = classname(classes, 'mainLayout');

const inter = Inter({ subsets: ['cyrillic'] });

export const metadata: Metadata = {
  title: 'ИПО ПЭС',
  description: 'Инструментальное программного обеспечение для построения экспертных систем',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ru" className={inter.className}>
      <body className={cnMainLayout()}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
