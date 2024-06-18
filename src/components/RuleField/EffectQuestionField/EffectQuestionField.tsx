import React, { memo, useCallback, useMemo } from 'react';
import { Control, useController } from 'react-hook-form';

import Dropdown, { Option } from '@/components/Dropdown';
import TrashIcon from '@/icons/TrashIcon';
import useRulePageStore from '@/store/rulePageStore';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import classes from './EffectQuestionField.module.scss';

type EffectQuestionFieldProps = {
  control: Control<TRuleForm>;
  ruleIndex: number;
  effectFieldIndex: number;
  handleDeleteQuestion: () => void;
};

const cnEffectQuestionField = classname(classes, 'effectAttribute');

const EffectQuestionField: React.FC<EffectQuestionFieldProps> = ({
  control,
  ruleIndex,
  effectFieldIndex,
  handleDeleteQuestion,
}) => {
  const questions = useRulePageStore((store) => store.questions);

  const { field: questionField } = useController({
    name: `formData.${ruleIndex}.rule_question_answer_ids.${effectFieldIndex}.question_id`,
    control,
  });
  const { field: answerField } = useController({
    name: `formData.${ruleIndex}.rule_question_answer_ids.${effectFieldIndex}.answer_id`,
    control,
  });

  const questionOptions = useMemo<Option[]>(
    () =>
      questions
        .filter((question) => question.with_chooses)
        .map((question) => ({ value: question.id, label: question.body })),
    [questions],
  );
  const questionValue = useMemo<Option>(
    () => ({
      value: questionField.value,
      label: questions.find((question) => question.id === questionField.value)?.body ?? '',
    }),
    [questionField.value, questions],
  );
  const handleQuestionChoose = useCallback(
    (option: Option) => {
      questionField.onChange(option.value);
      answerField.onChange('');
    },
    [questionField, answerField],
  );

  const attrValueOptions = useMemo<Option[]>(() => {
    const question = questions.find((question) => question.id === questionField.value);
    return question?.answers.map((answer) => ({ label: answer.body, value: answer.id })) ?? [];
  }, [questionField.value, questions]);

  const attrValueValue = useMemo<Option>(() => {
    const question = questions.find((question) => question.id === questionField.value);
    return {
      label: question?.answers.find((answer) => answer.id === answerField.value)?.body ?? '',
      value: answerField.value,
    };
  }, [questionField.value, answerField.value, questions]);

  const handleAnswerChoose = useCallback((option: Option) => answerField.onChange(option?.value), [answerField]);

  return (
    <div className={cnEffectQuestionField()}>
      <TrashIcon
        width={30}
        height={30}
        className={cnEffectQuestionField('deleteIcon')}
        onClick={handleDeleteQuestion}
      />
      <Dropdown
        options={questionOptions}
        value={questionValue}
        onChange={handleQuestionChoose}
        placeholder="Выберите вопрос"
        label="Вопрос"
      />
      <Dropdown
        options={attrValueOptions}
        value={attrValueValue}
        onChange={handleAnswerChoose}
        disabled={questionField.value === -1}
        placeholder="Выберите вариант ответа"
        label="Вариант ответа"
      />
    </div>
  );
};

export default memo(EffectQuestionField);
