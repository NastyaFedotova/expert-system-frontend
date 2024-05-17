'use client';
import React, { memo, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import Link from 'next/link';

import { LogoutIcon, UserIcon } from '@/icons';
import AddIcon from '@/icons/AddIcon';
import BookIcon from '@/icons/BookIcon';
import LoginIcon from '@/icons/LoginIcon';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';

import Loader from '../Loader';
import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './User.module.scss';

const cnUser = classname(classes, 'user');

const User: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLogin, logoutUser, reset: userStoreReset, fetchloading, user } = useUserStore((store) => store);

  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);

  const handlelogout = useCallback(() => {
    logoutUser();
    userStoreReset();
    setIsOpen(false);
  }, [logoutUser, userStoreReset]);

  return (
    <Popup
      open={isOpen}
      trigger={
        <span>
          {!fetchloading && !isLogin ? (
            <Link href="/login" className={cnUser()}>
              <LoginIcon />
            </Link>
          ) : (
            <div className={cnUser({ disable: fetchloading })}>
              {!fetchloading && isLogin ? <UserIcon /> : <Loader size="s" />}
            </div>
          )}
        </span>
      }
      position="bottom right"
      repositionOnResize
      onClose={closePopup}
      onOpen={openPopup}
    >
      {!fetchloading && isLogin && (
        <div className={cnUser('popup')} onClick={closePopup}>
          <div className={cnUser('username')}>
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18} color="secondary">
              {user?.username}
            </Text>
          </div>
          <Link href="/user" className={cnUser('options')}>
            <UserIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Личный кабинет
            </Text>
          </Link>
          <Link href="/system/create" className={cnUser('options')}>
            <AddIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Новая система
            </Text>
          </Link>
          <Link href="/instruction" className={cnUser('options')}>
            <BookIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Инструкция
            </Text>
          </Link>
          <div className={cnUser('options', { isLogin })} onClick={handlelogout}>
            <LogoutIcon />
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
              Выйти
            </Text>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default memo(User);
