import React, { memo } from 'react';
import Link from 'next/link';

import { classname } from '@/types/utils';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '../Text';
import { User } from '../User';

import styles from './Header.module.scss';

const cnHeader = classname(styles, 'header');

const Header: React.FC = () => {
  return (
    <header className={cnHeader()}>
      <div className={cnHeader('left-place')}>
        <Link href="/">
          <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.medium}>
            ИПО ПЭС
          </Text>
        </Link>
      </div>
      <User />
    </header>
  );
};

export default memo(Header);
