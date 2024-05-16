import React from 'react';

import CheckIcon from '@/icons/CheckIcon';
import { classname } from '@/types/utils';

import classes from './CheckBox.module.scss';

export type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement>;

const cnCheckBox = classname(classes, 'checkbox');

const CheckBox = React.forwardRef<HTMLInputElement, CheckBoxProps>(({ className, checked, ...props }, ref) => {
  return (
    <label className={cnCheckBox('container') + ` ${className}`}>
      <input {...props} ref={ref} checked={checked} type="checkbox" className={cnCheckBox()} />
      {checked && <CheckIcon className={cnCheckBox('icon')} />}
    </label>
  );
});

export default CheckBox;
