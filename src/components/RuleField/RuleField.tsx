import React, { memo, useCallback } from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { OPERATOR } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TQuestionWithAnswers } from '@/types/questions';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import Input from '../Input';
import Text, { TEXT_VIEW } from '../Text';

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

  const handleAddClauseGroup = useCallback(
    () =>
      clausesGroupAppend([
        [
          {
            id: -1,
            rule_id: ruleId,
            compared_value: '',
            logical_group: uuidv4(),
            operator: OPERATOR.EQUAL,
            question_id: -1,
            deleted: false,
          },
        ],
      ]),
    [clausesGroupAppend, ruleId],
  );

  return (
    <div className={cnFields()}>
      <CloseIcon width={30} height={30} className={cnFields('delete')} onClick={handleDeleteRule} />
      <Text view={TEXT_VIEW.p20} className={cnFields('title-up')}>
        Если:
      </Text>
      <div className={cnFields('clausesGroups')}>
        {clausesGroupFields.map((clauseGroup, clauseGroupIndex) => (
          <ClausesGroup
            key={clauseGroup.arrayId}
            control={control}
            setValue={setValue}
            ruleIndex={ruleIndex}
            ruleId={ruleId}
            clauseGroupIndex={clauseGroupIndex}
          />
        ))}
        <div className={cnFields('newClauseGroup')} key="new-newClauseGroup" onClick={handleAddClauseGroup}>
          <AddIcon width={30} height={30} className={cnFields('newClauseGroup-addIcon')} />
          <Text>Добавить логическую группу</Text>
        </div>
      </div>
      <Text view={TEXT_VIEW.p20} className={cnFields('title-bottom')}>
        То:
      </Text>
    </div>
  );
};

export default memo(RuleField);
