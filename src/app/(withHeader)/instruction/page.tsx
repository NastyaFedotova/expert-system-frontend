import React from 'react';

import { classname } from '@/utils';

import classes from './page.module.scss';

const cnInstructionPage = classname(classes, 'instruсtion');

const Page: React.FC = () => {
  return <div className={cnInstructionPage()}>инструкция</div>;
};

export default Page;
