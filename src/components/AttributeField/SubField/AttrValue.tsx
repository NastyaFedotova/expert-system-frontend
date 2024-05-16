import React, { memo } from 'react';
import { Control, useController } from 'react-hook-form';

import ErrorPopup from '@/components/ErrorPopup';
import TrashIcon from '@/icons/TrashIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { classname } from '@/types/utils';

import Input from '../../Input';

import classes from './AttrValue.module.scss';

type AttrValueProps = {
  attrIndex: number;
  attrValueIndex: number;
  control: Control<{
    formData: TAttributeWithAttributeValues[];
  }>;
  onDeleteClick: () => void;
};

const cnField = classname(classes, 'attrValue');

const AttrValue: React.FC<AttrValueProps> = ({ control, attrIndex, attrValueIndex, onDeleteClick }) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: `formData.${attrIndex}.values.${attrValueIndex}.value` });
  return (
    <div className={cnField()}>
      <TrashIcon width={30} height={30} className={cnField('deleteIcon')} onClick={onDeleteClick} />
      <Input
        {...field}
        className={cnField('input')}
        label="Значение"
        placeholder="Значение атрибута"
        afterSlot={<ErrorPopup error={error?.message} position="top right" offsetY={4} />}
        error={!!error}
      />
    </div>
  );
};

export default memo(AttrValue);
