import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';

import CheckBox from '@/components/CheckBox';
import { ArrowDownIcon } from '@/icons';
import { TAttributeValue } from '@/types/attributeValues';
import { TObjectWithAttrValuesForm } from '@/types/objects';
import { classname } from '@/utils';

import { useClickOutside } from '../../../hooks/useClickOutside';
import Input from '../../Input';
import Text, { TEXT_TAG, TEXT_VIEW } from '../../Text';

import classes from './ObjectMultiDropdown.module.scss';

export type ObjectMultiDropdownProps = {
  className?: string;
  control: Control<TObjectWithAttrValuesForm>;
  objectIndex: number;
  attrValues: TAttributeValue[];
  attributeId: number;
  attributeName: string;
};

const cnObjectMultiDropdown = classname(classes, 'multidropdown');

const ObjectMultiDropdown: React.FC<ObjectMultiDropdownProps> = ({
  className,
  objectIndex,
  control,
  attrValues,
  attributeId,
  attributeName,
}) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const { fields, remove, append } = useFieldArray({
    control,
    name: `formData.${objectIndex}.attributesValues`,
    keyName: 'arrayId',
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOnClickInput = useCallback(() => {
    setPopoverVisible(true);
  }, []);

  const handleOnClickOutside = useCallback(() => {
    setPopoverVisible(false);
  }, []);

  useClickOutside(dropdownRef, handleOnClickOutside);

  const attributeValues = useMemo(
    () => fields.filter((field) => field.attribute_id === attributeId),
    [attributeId, fields],
  );

  const inputValue = useMemo(() => attributeValues.map((val) => val.value).join('; '), [attributeValues]);

  const choosenValues = useMemo(() => attributeValues.map((val) => val.id), [attributeValues]);

  const onValueClick = useCallback(
    (attrValue: TAttributeValue) => () => {
      if (choosenValues.includes(attrValue.id)) {
        const attrValueIndex = fields.findIndex((value) => value.id === attrValue.id);
        remove(attrValueIndex);
      } else {
        append(attrValue);
      }
    },
    [append, choosenValues, fields, remove],
  );

  return (
    <div className={cnObjectMultiDropdown() + ` ${className}`} ref={dropdownRef}>
      <Input
        defaultValue={inputValue}
        viewOnly
        afterSlot={
          <ArrowDownIcon
            onClick={handleOnClickInput}
            color="secondary"
            className={cnObjectMultiDropdown('arrow', { popoverVisible })}
          />
        }
        label={attributeName.length > 32 ? attributeName.slice(0, 29).concat('...') : attributeName}
        labelTitle={attributeName}
        placeholder="Значения атрибута"
        onClick={handleOnClickInput}
      />
      {popoverVisible && (
        <div className={cnObjectMultiDropdown('options')}>
          {attrValues.map((attrValue) => (
            <div
              key={attrValue.id}
              onClick={onValueClick(attrValue)}
              className={cnObjectMultiDropdown('raw')}
              title={attrValue.value}
            >
              <CheckBox checked={choosenValues.includes(attrValue.id)} />
              <Text
                tag={TEXT_TAG.div}
                view={TEXT_VIEW.p16}
                className={cnObjectMultiDropdown('option')}
                color={choosenValues.includes(attrValue.id) ? 'accent' : 'primary'}
              >
                {attrValue.value}
              </Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ObjectMultiDropdown);
