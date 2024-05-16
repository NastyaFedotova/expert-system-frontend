import React, { memo, useCallback } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import { OPERATOR } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TQuestionWithAnswers } from '@/types/questions';
import { TRuleAttributeAttributeValue } from '@/types/ruleAttributeAttributeValue';
import { TRuleQuestionAnswer } from '@/types/ruleQuestionAnswer';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import Text, { TEXT_VIEW } from '../Text';

import ClausesGroup from './ClausesGroup/ClausesGroup';
import EffectAttributeField from './EffectAttributeField';
import EffectQuestionField from './EffectQuestionField';

import classes from './RuleField.module.scss';

type RuleFieldProps = {
  attributeRule: boolean;
  ruleId: number;
  ruleIndex: number;
  control: Control<TRuleForm>;
  handleDeleteRule: () => void;
  allAttributes: TAttributeWithAttributeValues[];
  allQuestions: TQuestionWithAnswers[];
};

const cnFields = classname(classes, 'fieldWithFields');

const RuleField: React.FC<RuleFieldProps> = ({ attributeRule, control, ruleIndex, ruleId, handleDeleteRule }) => {
  const {
    fields: attributesFields,
    append: attributesAppend,
    update: attributeUpdate,
    remove: attributeRemove,
  } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.rule_attribute_attributevalue_ids`,
    keyName: 'arrayId',
  });

  const {
    fields: questionFields,
    update: questionUpdate,
    remove: questionRemove,
    append: questionAppend,
  } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.rule_question_answer_ids`,
    keyName: 'arrayId',
  });

  const { fields: clausesGroupFields, append: clausesGroupAppend } = useFieldArray({
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

  const handleAddEffect = useCallback(
    () =>
      attributeRule
        ? attributesAppend({
            id: -1,
            rule_id: ruleId,
            attribute_id: -1,
            attribute_value_id: -1,
            deleted: false,
          })
        : questionAppend({ id: -1, rule_id: ruleId, answer_id: -1, question_id: -1, deleted: false }),
    [attributeRule, attributesAppend, questionAppend, ruleId],
  );

  const handleDeleteAttribute = useCallback(
    (attribute: TRuleAttributeAttributeValue, attributeIndex: number) => () => {
      if (attribute.id === -1) {
        attributeRemove(attributeIndex);
      } else {
        attributeUpdate(attributeIndex, {
          ...attribute,
          deleted: true,
        });
      }
    },
    [attributeRemove, attributeUpdate],
  );

  const handleDeleteQuestion = useCallback(
    (question: TRuleQuestionAnswer, questionIndex: number) => () => {
      if (question.id === -1) {
        questionRemove(questionIndex);
      } else {
        questionUpdate(questionIndex, {
          ...question,
          deleted: true,
        });
      }
    },
    [questionRemove, questionUpdate],
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
            ruleIndex={ruleIndex}
            ruleId={ruleId}
            clauseGroupIndex={clauseGroupIndex}
            lastClauseGroup={clausesGroupFields.length === clauseGroupIndex + 1}
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
      <div className={cnFields('clausesGroups')}>
        {attributeRule
          ? attributesFields.map((field, fieldIndex) => (
              <EffectAttributeField
                key={field.arrayId}
                control={control}
                ruleIndex={ruleIndex}
                effectFieldIndex={fieldIndex}
                handleDeleteAttribute={handleDeleteAttribute(field, fieldIndex)}
              />
            ))
          : questionFields.map((field, fieldIndex) => (
              <EffectQuestionField
                key={field.arrayId}
                control={control}
                ruleIndex={ruleIndex}
                effectFieldIndex={fieldIndex}
                handleDeleteQuestion={handleDeleteQuestion(field, fieldIndex)}
              />
            ))}
        <div className={cnFields('newClauseGroup')} key="new-newClauseGroup" onClick={handleAddEffect}>
          <AddIcon width={30} height={30} className={cnFields('newClauseGroup-addIcon')} />
          <Text>{attributeRule ? 'Добавить атрибут' : 'Добавить вопрос'}</Text>
        </div>
      </div>
    </div>
  );
};

export default memo(RuleField);
