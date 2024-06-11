import React from 'react';

import Text, { TEXT_TAG, TEXT_VIEW } from '@/components/Text';
import { INSTRACTIONS } from '@/constants';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnInstructionPage = classname(classes, 'instruсtion');

const Page: React.FC = () => {
  return (
    <div className={cnInstructionPage()}>
      <Text view={TEXT_VIEW.title} tag={TEXT_TAG.div} className={cnInstructionPage('title')}>
        Инструкция по созданию экспертных систем
      </Text>
      {INSTRACTIONS.map((text, index) => (
        <div key={index}>
          {text.text.map((line, lineIndex) => (
            <p key={lineIndex}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Page;
