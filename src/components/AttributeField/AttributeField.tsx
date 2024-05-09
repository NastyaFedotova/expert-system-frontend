import React, { memo, useCallback } from 'react';
import { Control, useController, useFieldArray } from 'react-hook-form';

import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { classname } from '@/utils';

import ErrorPopup from '../ErrorPopup';
import Input from '../Input';

import AttrValue from './SubField/AttrValue';

import classes from './AttributeField.module.scss';

type AttributeFieldProps = {
  attributeId: number;
  index: number;
  control: Control<{
    formData: TAttributeWithAttributeValues[];
  }>;
  onDelete: () => void;
};

const cnFields = classname(classes, 'fieldWithFields');

const AttributeField: React.FC<AttributeFieldProps> = ({ control, index, attributeId, onDelete }) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: `formData.${index}.name` });
  const { fields, remove, append } = useFieldArray({ control, name: `formData.${index}.values` });

  const handleDeleteAttrValue = useCallback((attrValueIndex: number) => () => remove(attrValueIndex), [remove]);
  const handleAddAttrValue = useCallback(
    () => append({ id: -1, attribute_id: attributeId, value: '' }),
    [append, attributeId],
  );

  return (
    <div className={cnFields()}>
      <CloseIcon width={30} height={30} className={cnFields('delete')} onClick={onDelete} />
      <Input
        {...field}
        className={cnFields('input')}
        label="Имя атрибута"
        placeholder="Имя атрибута"
        afterSlot={<ErrorPopup error={error?.message} position="top right" offsetY={4} />}
        error={!!error}
      />
      <div className={cnFields('attrValues')}>
        {fields.map((attrValue, attrValueIndex) => (
          <AttrValue
            key={attrValue.id}
            control={control}
            attrIndex={index}
            attrValueIndex={attrValueIndex}
            onDeleteClick={handleDeleteAttrValue(attrValueIndex)}
          />
        ))}
        <div className={cnFields('newValue')}>
          <AddIcon width={30} height={30} className={cnFields('newValue-addIcon')} onClick={handleAddAttrValue} />
          <Input
            className={cnFields('newValue-input')}
            placeholder="Добавить значение атрибута"
            onClick={handleAddAttrValue}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AttributeField);
