import React, { memo } from 'react';

import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  error?: boolean;
};

const cnInput = classname(classes, 'input');

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ afterSlot, className, type = 'text', error, ...props }, ref) => {
    return (
      <Text tag={TEXT_TAG.div} view={TEXT_VIEW.p16} className={cnInput('container', { error }) + ` ${className}`}>
        <input {...props} ref={ref} type={type} className={cnInput()} />
        {afterSlot}
      </Text>
    );
  },
);

export default memo(Input);
