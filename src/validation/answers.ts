import { z } from 'zod';

export const answerValidation = z.object({
  id: z.number(),
  question_id: z.number(),
  body: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
});

export const answerUpdateValidation = answerValidation.omit({ question_id: true });

export const answerNewValidation = answerValidation.omit({ id: true });
