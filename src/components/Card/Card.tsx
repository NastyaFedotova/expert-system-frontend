'use client';
import React, { memo, MouseEventHandler, ReactNode, useCallback, useState } from 'react';
import { isDesktop } from 'react-device-detect';
import Image from 'next/image';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import EditIcon from '@/icons/EditIcon';
import TrashIcon from '@/icons/TrashIcon';
import defaultImage from '@/public/default-image.png';
import { classname } from '@/utils';

import classes from './Card.module.scss';

export type CardProps = {
  id: number;
  className?: string;
  image: string;
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler;
  canDelete?: boolean;
  onDeleteClick?: (id: number) => void;
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
  const [isError, setIsError] = useState(false);
  const errorHandler = useCallback(() => setIsError(true), []);
  const handleDelete = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      onDeleteClick?.(id);
    },
    [id, onDeleteClick],
  );
  const handleEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      onEditClick?.(id);
    },
    [id, onEditClick],
  );

  return (
    <div className={cnCard() + ` ${className}`} onClick={onClick} id={String(id)}>
      <Image
        alt="logo"
        src={isError ? defaultImage : image}
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
        <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" maxLines={3}>
          {subtitle}
        </Text>
      </div>
      {canDelete && (
        <TrashIcon
          width={32}
          height={32}
          className={cnCard('deleteIcon')}
          style={{ opacity: isDesktop ? 0.5 : 1 }}
          onClick={handleDelete}
        />
      )}
      {canEdit && (
        <EditIcon
          width={32}
          height={32}
          className={cnCard('editIcon')}
          style={{ opacity: isDesktop ? 0.5 : 1 }}
          onClick={handleEdit}
        />
      )}
    </div>
  );
};

export default memo(Card);
