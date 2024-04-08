'use client';
import React, { memo, MouseEventHandler, ReactNode } from 'react';
import Image from 'next/image';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import { classname } from '@/utils';

import classes from './Card.module.scss';

export type CardProps = {
  id?: string;
  className?: string;
  image: string;
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler;
};

const cnCard = classname(classes, 'card');

const Card = ({ className, id, image, title, subtitle, onClick }: CardProps) => (
  <div className={cnCard() + ` ${className}`} onClick={onClick} id={id}>
    <Image
      alt="logo"
      src={image}
      className={cnCard('image')}
      width={280}
      height={280}
      style={{
        objectFit: 'cover',
      }}
    />
    <div className={cnCard('info')}>
      <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.medium} maxLines={2}>
        {title}
      </Text>
      <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" maxLines={3}>
        {subtitle}
      </Text>
    </div>
  </div>
);

export default memo(Card);
