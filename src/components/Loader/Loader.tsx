import React, { memo } from 'react';

import { classname } from '@/types/utils';

import classes from './Loader.module.scss';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
  sizepx?: number;
};

const cnLoader = classname(classes, 'loader');

const Loader: React.FC<LoaderProps> = React.memo(({ size = 'l', className, sizepx }) => (
  <div
    className={cnLoader({ size }) + ` ${className}`}
    style={{ borderTopColor: 'transparent', width: sizepx, height: sizepx }}
  />
));

export default memo(Loader);
