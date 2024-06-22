import React from 'react';

import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './Input.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  error?: boolean;
  label?: string;
  labelTitle?: string;
  viewOnly?: boolean;
};

const cnInput = classname(classes, 'input');

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ afterSlot, className, type = 'text', error, label, labelTitle, viewOnly, ...props }, ref) => {
    return (
      <Text
        tag={TEXT_TAG.div}
        view={TEXT_VIEW.p16}
        className={cnInput('container', { error: !!error }) + ` ${className}`}
      >
        <div className={cnInput('label', { visible: !!label })} title={labelTitle}>
          {label}
        </div>
        <input {...props} ref={ref} type={type} className={cnInput({ viewOnly })} />
        {afterSlot}
      </Text>
    );
  },
);

export default Input;
