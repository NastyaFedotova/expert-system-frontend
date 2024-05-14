import React, { memo, useCallback } from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';

import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TQuestionWithAnswers } from '@/types/questions';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import Input from '../Input';

import ClausesGroup from './ClausesGroup/ClausesGroup';

import classes from './RuleField.module.scss';

type RuleFieldProps = {
  attributeRule: boolean;
  ruleId: number;
  ruleIndex: number;
  control: Control<TRuleForm>;
  setValue: UseFormSetValue<TRuleForm>;
  handleDeleteRule: () => void;
  allAttributes: TAttributeWithAttributeValues[];
  allQuestions: TQuestionWithAnswers[];
};

const cnFields = classname(classes, 'fieldWithFields');

const RuleField: React.FC<RuleFieldProps> = ({
  attributeRule,
  control,
  ruleIndex,
  ruleId,
  setValue,
  handleDeleteRule,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: attributeRule
      ? `formData.${ruleIndex}.rule_attribute_attributevalue_ids`
      : `formData.${ruleIndex}.rule_question_answer_ids`,
    keyName: 'arrayId',
  });

  const {
    fields: clausesGroupFields,
    append: clausesGroupAppend,
    remove: clausesGroupRemove,
  } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.clauses`,
    keyName: 'arrayId',
  });

  const handleAddClauseGroup = useCallback(() => clausesGroupAppend([]), [clausesGroupAppend]);

  return (
    <div className={cnFields()}>
      <CloseIcon width={30} height={30} className={cnFields('delete')} onClick={handleDeleteRule} />
      <div className={cnFields('attrValues')}>
        {clausesGroupFields.map((clauseGroup, clauseGroupIndex) => (
          <ClausesGroup
            key={clauseGroup.arrayId}
            control={control}
            setValue={setValue}
            ruleIndex={ruleIndex}
            clouseGroupIndex={clauseGroupIndex}
          />
        ))}
        <div className={cnFields('newValue')} key="new-attrValue">
          <AddIcon width={30} height={30} className={cnFields('newValue-addIcon')} onClick={handleAddClauseGroup} />
          <Input
            className={cnFields('newValue-input')}
            placeholder="Добавить логическую группу"
            onClick={handleAddClauseGroup}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(RuleField);
