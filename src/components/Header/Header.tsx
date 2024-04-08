import React from 'react';

import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '../Text';

import styles from './Header.module.scss';

const cnHeader = classname(styles, 'header');

export const Header: React.FC = () => {
  return (
    <header className={cnHeader()}>
      <div className={cnHeader('left-place')}>
        <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.medium}>
          ИПО ПЭС
        </Text>
      </div>
      <div className={cnHeader('right-place')}></div>
    </header>
  );
};
