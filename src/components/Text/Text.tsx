import React, { memo, ReactHTML } from 'react';

import { classname } from '@/utils';

import { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from './Text.types';

import classes from './Text.module.scss';

export type TextProps = {
  /** Дополнительный класс */
  className?: string;
  /** Стиль отображения */
  view?: TEXT_VIEW;
  /** Html-тег */
  tag?: TEXT_TAG;
  /** Начертание шрифта */
  weight?: TEXT_WEIGHT;
  /** Контент */
  children: React.ReactNode;
  /** Цвет */
  color?: 'primary' | 'secondary' | 'accent';
  /** Максимальное кол-во строк */
  maxLines?: number;
  title?: string;
  onClick?: () => void;
};

const cnTest = classname(classes, 'text');

const Text: React.FC<TextProps> = ({
  className,
  view,
  tag = TEXT_TAG.p,
  weight,
  children,
  color,
  maxLines,
  title,
  onClick,
}) => {
  const Tag = tag as keyof ReactHTML;
  return (
    <Tag
      className={cnTest({ color, view }) + ` ${className ?? ''}`}
      style={{
        WebkitLineClamp: maxLines,
        fontWeight: weight === TEXT_WEIGHT.medium ? 500 : weight,
        overflow: maxLines ? 'hidden' : 'visible',
      }}
      onClick={onClick}
      title={title}
    >
      {children}
    </Tag>
  );
};

export default memo(Text);
