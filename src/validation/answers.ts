import { z } from 'zod';

export const answersValidation = z.object({
  id: z.number(),
  question_id: z.number(),
  body: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
});

export const answersUpdateValidation = answersValidation.omit({ question_id: true });

export const answersNewValidation = answersValidation.omit({ id: true });
