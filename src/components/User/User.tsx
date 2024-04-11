'use client';
import React, { memo, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import Link from 'next/link';

import { LogoutIcon, UserIcon } from '@/icons';
import LoginIcon from '@/icons/LoginIcon';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './User.module.scss';

const cnUser = classname(classes, 'user');

const User: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);

  const { isLogin, logoutUser } = useUserStore((store) => store);

  const handlelogout = useCallback(() => logoutUser(), [logoutUser]);
  return (
    <Popup
      open={isOpen}
      trigger={
        <div className={cnUser()}>
          <UserIcon />
        </div>
      }
      on="click"
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
        {isLogin ? (
          <div className={cnUser('options', { isLogin })} onClick={handlelogout}>
            <LogoutIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Выйти
            </Text>
          </div>
        ) : (
          <Link href="/login" className={cnUser('options', { isLogin })}>
            <LoginIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Войти
            </Text>
          </Link>
        )}
      </div>
    </Popup>
  );
};

export default memo(User);
