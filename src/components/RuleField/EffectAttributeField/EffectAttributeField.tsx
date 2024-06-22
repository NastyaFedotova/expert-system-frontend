import React, { useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

import Dropdown, { Option } from '@/components/Dropdown';
import TrashIcon from '@/icons/TrashIcon';
import useRulePageStore from '@/store/rulePageStore';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import classes from './EffectAttributeField.module.scss';

type EffectAttributeFieldProps = {
  isVisible?: boolean;
  control: Control<TRuleForm>;
  ruleIndex: number;
  effectFieldIndex: number;
  handleDeleteAttribute: () => void;
};

const cnEffectAttributeField = classname(classes, 'effectAttribute');

const EffectAttributeField: React.FC<EffectAttributeFieldProps> = ({
  isVisible = true,
  control,
  ruleIndex,
  effectFieldIndex,
  handleDeleteAttribute,
}) => {
  const attributes = useRulePageStore((store) => store.attributes);

  const { field: attributeField } = useController({
    name: `formData.${ruleIndex}.rule_attribute_attributevalue_ids.${effectFieldIndex}.attribute_id`,
    control,
  });
  const { field: attributeValueField } = useController({
    name: `formData.${ruleIndex}.rule_attribute_attributevalue_ids.${effectFieldIndex}.attribute_value_id`,
    control,
  });

  const attributeOptions = useMemo<Option[]>(
    () => attributes.map((attribute) => ({ value: attribute.id, label: attribute.name })),
    [attributes],
  );
  const attributeValue = useMemo<Option>(
    () => ({
      value: attributeField.value,
      label: attributes.find((attribute) => attribute.id === attributeField.value)?.name ?? '',
    }),
    [attributeField.value, attributes],
  );
  const handleAttributeChoose = useCallback(
    (option: Option) => {
      attributeField.onChange(option.value);
      attributeValueField.onChange('');
    },
    [attributeField, attributeValueField],
  );

  const attrValueOptions = useMemo<Option[]>(() => {
    const attribute = attributes.find((attribute) => attribute.id === attributeField.value);
    return attribute?.values.map((value) => ({ label: value.value, value: value.id })) ?? [];
  }, [attributeField.value, attributes]);

  const attrValueValue = useMemo<Option>(() => {
    const attribute = attributes.find((attribute) => attribute.id === attributeField.value);
    return {
      label: attribute?.values.find((value) => value.id === attributeValueField.value)?.value ?? '',
      value: attributeValueField.value,
    };
  }, [attributeField.value, attributeValueField.value, attributes]);

  const handleAttrValueChoose = useCallback(
    (option: Option) => attributeValueField.onChange(option?.value),
    [attributeValueField],
  );

  if (!isVisible) {
    return isVisible;
  }

  return (
    <div className={cnEffectAttributeField()}>
      <TrashIcon
        width={30}
        height={30}
        className={cnEffectAttributeField('deleteIcon')}
        onClick={handleDeleteAttribute}
      />
      <Dropdown
        options={attributeOptions}
        value={attributeValue}
        onChange={handleAttributeChoose}
        placeholder="Выберите атрибут"
        label="Атрибут"
      />
      <Dropdown
        options={attrValueOptions}
        value={attrValueValue}
        onChange={handleAttrValueChoose}
        disabled={attributeField.value === -1}
        placeholder="Значение атрибута"
        label="Значение атрибута"
      />
    </div>
  );
};

export default EffectAttributeField;
