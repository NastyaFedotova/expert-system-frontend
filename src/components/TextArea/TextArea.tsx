import React, { memo } from 'react';

import { classname } from '@/utils';

import Text, { TEXT_TAG, TEXT_VIEW } from '../Text';

import classes from './TextArea.module.scss';

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
  error?: boolean;
  label?: string | boolean;
};

const cnTextArea = classname(classes, 'textArea');

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ afterSlot, className, error, label, ...props }, ref) => {
    return (
      <Text
        tag={TEXT_TAG.div}
        view={TEXT_VIEW.p16}
        className={cnTextArea('container', { error: !!error }) + ` ${className}`}
      >
        <div className={cnTextArea('label', { visible: !!label })}>{label}</div>
        <textarea {...props} ref={ref} className={cnTextArea()} />
        {afterSlot}
      </Text>
    );
  },
);

export default memo(TextArea);
