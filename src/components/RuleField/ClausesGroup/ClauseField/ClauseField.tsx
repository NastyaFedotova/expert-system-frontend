import React, { memo, useCallback, useMemo, useState } from 'react';
import { Control, useController } from 'react-hook-form';

import Dropdown, { Option } from '@/components/Dropdown';
import { OPERATOR, operatorOptions } from '@/constants';
import TrashIcon from '@/icons/TrashIcon';
import useRulePageStore from '@/store/rulePageStore';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/types/utils';
import operatorToSymbol from '@/types/utils/operatorEnumToSymbol';

import classes from './ClauseField.module.scss';

type ClauseFieldProps = {
  control: Control<TRuleForm>;
  ruleIndex: number;
  clauseGroupIndex: number;
  clauseIndex: number;
  deleteClause: () => void;
};

const cnClauseField = classname(classes, 'clause');

const ClauseField: React.FC<ClauseFieldProps> = ({
  control,
  ruleIndex,
  clauseGroupIndex,
  clauseIndex,
  deleteClause,
}) => {
  const { questions } = useRulePageStore((store) => store);

  const [openQuestion, setOpenQuestion] = useState(false);

  const { field: questionIdField } = useController({
    name: `formData.${ruleIndex}.clauses.${clauseGroupIndex}.${clauseIndex}.question_id`,
    control,
  });
  const { field: operatorField } = useController({
    name: `formData.${ruleIndex}.clauses.${clauseGroupIndex}.${clauseIndex}.operator`,
    control,
  });
  const { field: answerField } = useController({
    name: `formData.${ruleIndex}.clauses.${clauseGroupIndex}.${clauseIndex}.compared_value`,
    control,
  });

  const questionsOptions = useMemo<Option[]>(
    () => questions.map((question) => ({ value: question.id, label: question.body })),
    [questions],
  );
  const questionValue = useMemo<Option>(
    () => ({
      value: questionIdField.value,
      label: questions.find((question) => question.id === questionIdField.value)?.body ?? '',
    }),
    [questionIdField.value, questions],
  );
  const handleQuestionChoose = useCallback(
    (option: Option) => {
      const question = questions.find((question) => question.id === option.value);
      questionIdField.onChange(option.value);
      operatorField.onChange(OPERATOR.EQUAL);
      answerField.onChange('');
      setOpenQuestion(!question?.with_chooses);
    },
    [answerField, operatorField, questionIdField, questions],
  );

  const operatorValue = useMemo<Option>(
    () => ({
      value: operatorField.value,
      label: operatorToSymbol(operatorField.value),
    }),
    [operatorField.value],
  );
  const handleOperatorChoose = useCallback(
    (option: Option) => {
      operatorField.onChange(option?.value);
    },
    [operatorField],
  );

  const answersOptions = useMemo<Option[]>(() => {
    const question = questions.find((question) => question.id === questionIdField.value);
    return question?.answers.map((answer) => ({ label: answer.body, value: answer.body })) ?? [];
  }, [questionIdField.value, questions]);

  const answerValue = useMemo<Option>(
    () => ({
      label: answerField.value,
      value: answerField.value,
    }),
    [answerField.value],
  );

  const handleAnswerChoose = useCallback((option: Option) => answerField.onChange(option?.label), [answerField]);

  return (
    <div className={cnClauseField()}>
      <TrashIcon width={30} height={30} className={cnClauseField('deleteIcon')} onClick={deleteClause} />
      <Dropdown
        options={questionsOptions}
        value={questionValue}
        onChange={handleQuestionChoose}
        placeholder="Выберите вопрос"
        label="Вопрос"
      />
      <Dropdown
        options={openQuestion ? operatorOptions : operatorOptions.slice(0, 2)}
        value={operatorValue}
        onChange={handleOperatorChoose}
        disabled={questionIdField.value === -1}
        className={cnClauseField('dropdown-operator')}
      />
      <Dropdown
        options={answersOptions}
        value={answerValue}
        onChange={handleAnswerChoose}
        disabled={questionIdField.value === -1}
        placeholder="Выберите вариант ответа"
        onlyInput={openQuestion}
        inputType={openQuestion ? 'number' : undefined}
        label="Ответ"
      />
    </div>
  );
};

export default memo(ClauseField);
