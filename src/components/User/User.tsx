'use client';
import React, { memo, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import Link from 'next/link';

import { LogoutIcon, UserIcon } from '@/icons';
import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './User.module.scss';

const cnUser = classname(classes, 'user');

const User: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);
  return (
    <Popup
      open={isOpen}
      trigger={
        <div className={cnUser()}>
          <UserIcon />
        </div>
      }
      on="hover"
      position="bottom right"
      repositionOnResize
      onClose={closePopup}
      onOpen={openPopup}
    >
      <div className={cnUser('popup')} onClick={closePopup}>
        <Link href="/user" className={cnUser('options', { user: true })}>
          <UserIcon />
          <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
            Личный кабинет
          </Text>
        </Link>
        <div className={cnUser('options', { logout: true })}>
          <LogoutIcon />
          <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
            Выйти
          </Text>
        </div>
      </div>
    </Popup>
  );
};

export default memo(User);
