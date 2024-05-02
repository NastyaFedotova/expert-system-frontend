'use client';
import React, { ChangeEvent, memo, MouseEventHandler, ReactNode, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import Image from 'next/image';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import CloseIcon from '@/icons/CloseIcon';
import EditIcon from '@/icons/EditIcon';
import TrashIcon from '@/icons/TrashIcon';
import defaultImage from '@/public/default-image.png';
import { classname, imageUrl } from '@/utils';

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
  canDelete?: boolean;
  onDeleteClick?: (id: number, password: string) => void;
  canEdit?: boolean;
  onEditClick?: (id: number) => void;
};

const cnCard = classname(classes, 'card');

const Card: React.FC<CardProps> = ({
  className,
  id,
  image,
  title,
  subtitle,
  canDelete,
  canEdit,
  onClick,
  onDeleteClick,
  onEditClick,
}: CardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState('');

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setPassword('');
  }, []);
  const openPopup = useCallback(() => setIsOpen(true), []);
  const errorHandler = useCallback(() => setIsError(true), []);
  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onDeleteClick?.(id, password);
      closePopup();
    },
    [closePopup, id, onDeleteClick, password],
  );
  const handleEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      onEditClick?.(id);
    },
    [id, onEditClick],
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
      {canDelete && (
        <Popup
          trigger={<TrashIcon width={32} height={32} className={cnCard('deleteIcon')} onClick={openPopup} />}
          open={isOpen}
          onClose={closePopup}
          onOpen={openPopup}
          modal
          closeOnDocumentClick
          repositionOnResize
          closeOnEscape
        >
          <div className={cnCard('modal')}>
            <CloseIcon className={cnCard('closeIcon')} onClick={closePopup} />
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
      )}
      {canEdit && <EditIcon width={32} height={32} className={cnCard('editIcon')} onClick={handleEdit} />}
    </div>
  );
};

export default memo(Card);
