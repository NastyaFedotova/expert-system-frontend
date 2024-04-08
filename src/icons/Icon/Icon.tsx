import React, { PropsWithChildren } from 'react';

import { classname } from '@/utils';

import classes from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent';
};

const cnIcon = classname(classes, 'icon');

const Icon: React.FC<PropsWithChildren & IconProps> = ({
  className,
  color,
  width = 24,
  height = 24,
  children,
  ...props
}) => (
  <svg
    {...props}
    className={cnIcon({ color }) + ` ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    width={width}
    height={height}
  >
    {children}
  </svg>
);

export default Icon;
