import React from 'react';

import { classname } from '@/utils';

import classes from './Loader.module.scss';

export type LoaderProps = {
  /** Размер */
  size?: 's' | 'm' | 'l';
  /** Дополнительный класс */
  className?: string;
  sizepx?: number;
};

const cnLoader = classname(classes, 'loader');

const Loader: React.FC<LoaderProps> = ({ size = 'l', className, sizepx }) => (
  <div
    className={cnLoader({ size }) + ` ${className}`}
    style={{ borderTopColor: 'transparent', width: sizepx, height: sizepx }}
  />
);

export default Loader;
