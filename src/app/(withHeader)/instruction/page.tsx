import React from 'react';

import { INSTRACTIONS } from '@/constants';
import { classname } from '@/utils';

import classes from './page.module.scss';

const cnInstructionPage = classname(classes, 'instruсtion');

const Page: React.FC = () => {
  return (
    <div className={cnInstructionPage()}>
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
