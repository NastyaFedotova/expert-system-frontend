import React, { memo } from 'react';
import { Control, useController } from 'react-hook-form';

import ErrorPopup from '@/components/ErrorPopup';
import TrashIcon from '@/icons/TrashIcon';
import { TQuestionWithAnswersForm } from '@/types/questions';
import { classname } from '@/utils';

import Input from '../../Input';

import classes from './AnswerField.module.scss';

type AttrValueProps = {
  questionIndex: number;
  answerIndex: number;
  control: Control<TQuestionWithAnswersForm>;
  onDeleteClick: () => void;
};

const cnField = classname(classes, 'answer');

const AnswerField: React.FC<AttrValueProps> = ({ control, questionIndex, answerIndex, onDeleteClick }) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name: `formData.${questionIndex}.answers.${answerIndex}.body` });
  return (
    <div className={cnField()}>
      <TrashIcon width={30} height={30} className={cnField('deleteIcon')} onClick={onDeleteClick} />
      <Input
        {...field}
        className={cnField('input')}
        label="Вариант ответа"
        placeholder="Вариант ответа"
        afterSlot={<ErrorPopup error={error?.message} position="top right" offsetY={4} />}
        error={!!error}
      />
    </div>
  );
};

export default memo(AnswerField);
