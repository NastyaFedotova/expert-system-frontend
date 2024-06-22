'use client';
import React, { useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';

import { logoutUserResponse } from '@/api/services/user';
import { USER } from '@/constants';
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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isLogin,
    reset: userStoreReset,
    user,
  } = useUserStore(useShallow((store) => ({ isLogin: store.isLogin, reset: store.reset, user: store.user })));

  const { mutate, isPending } = useMutation({
    mutationKey: [USER.LOGOUT],
    mutationFn: logoutUserResponse,
    onSuccess: () => {
      router.replace('/');
      Cookies.remove('session_id');
      userStoreReset();
    },
    gcTime: 0,
  });

  const closePopup = useCallback(() => setIsOpen(false), []);
  const openPopup = useCallback(() => setIsOpen(true), []);

  const handlelogout = useCallback(() => {
    mutate();
    setIsOpen(false);
  }, [mutate]);

  return (
    <Popup
      open={isOpen}
      trigger={
        <span>
          {!isPending && !isLogin ? (
            <Link href="/login" className={cnUser()}>
              <LoginIcon />
            </Link>
          ) : (
            <div className={cnUser({ disable: isPending })}>
              {!isPending && isLogin ? <UserIcon /> : <Loader size="s" />}
            </div>
          )}
        </span>
      }
      position="bottom right"
      repositionOnResize
      onClose={closePopup}
      onOpen={openPopup}
    >
      {!isPending && isLogin && (
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

export default User;
