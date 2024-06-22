import React, { useCallback } from 'react';
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
  isVisible?: boolean;
  attributeId: number;
  index: number;
  control: Control<{
    formData: TAttributeWithAttributeValues[];
  }>;
  onDelete: () => void;
  onAttributeValueDelete: (attrValueId: number) => void;
  deletedSubFieldIds: number[];
};

const cnFields = classname(classes, 'fieldWithFields');

const AttributeField: React.FC<AttributeFieldProps> = ({
  isVisible = true,
  control,
  index,
  attributeId,
  onDelete,
  onAttributeValueDelete,
  deletedSubFieldIds,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: `formData.${index}.name` });
  const { fields, append, remove } = useFieldArray({ control, name: `formData.${index}.values`, keyName: 'arrayId' });

  const handleDeleteAttrValue = useCallback(
    (attrValueId: number, attrValueIndex: number) => () => {
      if (attrValueId === -1) {
        remove(attrValueIndex);
      } else {
        onAttributeValueDelete(attrValueId);
      }
    },
    [onAttributeValueDelete, remove],
  );
  const handleAddAttrValue = useCallback(
    () => append({ id: -1, attribute_id: attributeId, value: '' }),
    [append, attributeId],
  );

  if (!isVisible) {
    return null;
  }

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
            key={attrValue.arrayId}
            isVisible={!deletedSubFieldIds.includes(attrValue.id)}
            control={control}
            attrIndex={index}
            attrValueIndex={attrValueIndex}
            onDeleteClick={handleDeleteAttrValue(attrValue.id, attrValueIndex)}
          />
        ))}
        <div className={cnFields('newValue')} key="new-attrValue">
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

export default AttributeField;
