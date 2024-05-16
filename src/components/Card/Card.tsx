'use client';
import React, { ChangeEvent, memo, MouseEventHandler, ReactNode, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import Image from 'next/image';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import CloseIcon from '@/icons/CloseIcon';
import DotsIcon from '@/icons/DotsIcon';
import DownloadIcon from '@/icons/DownloadIcon';
import EditIcon from '@/icons/EditIcon';
import TrashIcon from '@/icons/TrashIcon';
import defaultImage from '@/public/default-image.png';
import { classname, imageUrl } from '@/types/utils';

import Button from '../Button';
import Input from '../Input';

import classes from './Card.module.scss';

export type CardProps = {
  id: number;
  className?: string;
  image?: string;
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler;
  modifiable?: boolean;
  onDeleteClick?: (id: number, password: string) => void;
  onEditClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDownloadClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const cnCard = classname(classes, 'card');

const Card: React.FC<CardProps> = ({
  className,
  id,
  image,
  title,
  subtitle,
  modifiable,
  onClick,
  onDeleteClick,
  onEditClick,
}: CardProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState('');

  const closeDeletePopup = useCallback(() => {
    setIsDeleteOpen(false);
    setPassword('');
  }, []);
  const openDeletePopup = useCallback(() => setIsDeleteOpen(true), []);

  const closeOptionPopup = useCallback(() => setIsOptionOpen(false), []);
  const openOptionPopup = useCallback(() => setIsOptionOpen(true), []);

  const errorHandler = useCallback(() => setIsError(true), []);
  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDeleteClick?.(id, password);
      closeDeletePopup();
    },
    [closeDeletePopup, id, onDeleteClick, password],
  );

  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setPassword(event.currentTarget.value),
    [],
  );

  return (
    <div className={cnCard() + ` ${className}`} onClick={onClick} id={String(id)}>
      <Image
        alt="logo"
        src={isError || !image ? defaultImage : imageUrl(image)}
        className={cnCard('image')}
        width={280}
        height={280}
        style={{
          objectFit: 'cover',
        }}
        quality={100}
        onError={errorHandler}
      />
      <div className={cnCard('info')}>
        <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.medium} maxLines={2}>
          {title}
        </Text>
        <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" maxLines={3} className={cnCard('subtitle')}>
          {subtitle}
        </Text>
      </div>
      {modifiable && (
        <>
          <Popup
            trigger={<TrashIcon width={32} height={32} className={cnCard('deleteIcon')} />}
            open={isDeleteOpen}
            onClose={closeDeletePopup}
            onOpen={openDeletePopup}
            modal
            closeOnDocumentClick
            repositionOnResize
            closeOnEscape
          >
            <div className={cnCard('modal')}>
              <CloseIcon className={cnCard('closeIcon')} onClick={closeDeletePopup} />
              <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnCard('modal-text')}>
                Подтверждение удаления
              </Text>
              <Text view={TEXT_VIEW.p16} className={cnCard('modal-text')}>
                {`Для подтверждения удаления Вам необходимо ввести пароль от вашей учетной записи.`}
              </Text>
              <Input
                value={password}
                onChange={onInputChange}
                className={cnCard('input', { modal: true })}
                required
                placeholder={'введите пароль'}
                autoComplete="password"
                type="password"
              />
              <Button className={cnCard('button')} onClick={handleDelete}>
                Удалить систему
              </Button>
            </div>
          </Popup>
          <Popup
            open={isOptionOpen}
            trigger={<DotsIcon width={32} height={32} className={cnCard('dotsIcon', { active: isOptionOpen })} />}
            position="bottom left"
            repositionOnResize
            onClose={closeOptionPopup}
            onOpen={openOptionPopup}
          >
            <div className={cnCard('popup')} onClick={closeOptionPopup}>
              <div className={cnCard('options')} onClick={onEditClick}>
                <EditIcon />
                <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
                  Редактировать
                </Text>
              </div>
              <a className={cnCard('options')} onClick={undefined} download="backup.txt">
                <DownloadIcon />
                <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p18}>
                  Скачать копию
                </Text>
              </a>
            </div>
          </Popup>
        </>
      )}
    </div>
  );
};

export default memo(Card);
