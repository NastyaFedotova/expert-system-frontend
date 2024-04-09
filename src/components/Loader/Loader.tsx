import React, { memo } from 'react';

import { classname } from '@/utils';

import classes from './Loader.module.scss';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
};

const cnLoader = classname(classes, 'loader');

const Loader: React.FC<LoaderProps> = React.memo(({ size = 'l', className }) => (
  <div className={cnLoader({ size }) + ` ${className}`} style={{ borderTopColor: 'transparent' }} />
));

export default memo(Loader);
