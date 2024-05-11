import { z } from 'zod';

import {
  formQuestionWithAnswersValidation,
  questionUpdateValidation,
  questionWithAnswersNewValidation,
  questionWithAnswersValidation,
} from '@/validation/questions';

export type TQuestionsWithAnswers = z.infer<typeof questionWithAnswersValidation>;

export type TQuestionsWithAnswersNew = z.infer<typeof questionWithAnswersNewValidation>;

export type TQuestionsUpdate = z.infer<typeof questionUpdateValidation>;

export type TQuestionsWithAnswersForm = z.infer<typeof formQuestionWithAnswersValidation>;
