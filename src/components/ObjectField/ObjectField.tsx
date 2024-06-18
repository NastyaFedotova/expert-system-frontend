import React from 'react';
import { Control, useController } from 'react-hook-form';

import CloseIcon from '@/icons/CloseIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TObjectWithAttrValuesForm } from '@/types/objects';
import { classname } from '@/utils';

import ErrorPopup from '../ErrorPopup';
import Input from '../Input';

import ObjectMultiDropdown from './ObjectMultiDropdown';

import classes from './ObjectField.module.scss';

type ObjectFieldProps = {
  objectId: number;
  objectIndex: number;
  control: Control<TObjectWithAttrValuesForm>;
  allAttributes: TAttributeWithAttributeValues[];
  onDelete: () => void;
};

const cnFields = classname(classes, 'fieldWithFields');

const ObjectField: React.FC<ObjectFieldProps> = ({ control, objectIndex, onDelete, allAttributes }) => {
  const {
    field: bodyField,
    fieldState: { error: bodyError },
  } = useController({ control, name: `formData.${objectIndex}.name` });

  return (
    <div className={cnFields()}>
      <CloseIcon width={30} height={30} className={cnFields('delete')} onClick={onDelete} />
      <Input
        {...bodyField}
        className={cnFields('input')}
        label="Объект"
        placeholder="Объект"
        afterSlot={<ErrorPopup error={bodyError?.message} position="top right" offsetY={4} />}
        error={!!bodyError}
      />
      <div className={cnFields('line')} />
      <div className={cnFields('attributes')}>
        {allAttributes.map((attribute) => (
          <ObjectMultiDropdown
            key={attribute.id}
            attributeId={attribute.id}
            attributeName={attribute.name}
            objectIndex={objectIndex}
            control={control}
            attrValues={attribute.values}
          />
        ))}
      </div>
    </div>
  );
};

export default ObjectField;
