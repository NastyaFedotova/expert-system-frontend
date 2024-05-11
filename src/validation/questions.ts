import { number, z } from 'zod';

import { answersValidation } from './answers';

export const questionValidation = z.object({
  id: z.number(),
  system_id: number().positive(),
  body: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
  with_chooses: z.boolean(),
});

export const questionWithAnswersValidation = questionValidation.extend({
  answers: z.array(answersValidation),
});

export const questionWithAnswersNewValidation = questionValidation.omit({ id: true }).extend({
  answers_body: z.array(z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128')),
});

export const formQuestionWithAnswersValidation = z.object({ formData: z.array(questionWithAnswersValidation) });

export const questionUpdateValidation = questionValidation.omit({ system_id: true });
