import { z } from 'zod';

import { RUS_LETTERS_ONLY } from '@/constants';

export const userValidation = z.object({
  id: z.number().positive(),
  email: z.string().email('Некорректный формат почты'),
  username: z.string(),
  created_at: z.string().datetime({ offset: true }),
  first_name: z.string().regex(RUS_LETTERS_ONLY, 'Только русские буквы'),
  last_name: z.string().regex(RUS_LETTERS_ONLY, 'Только русские буквы'),
});

export const userRegistrationValidation = userValidation
  .omit({ id: true, created_at: true })
  .extend({
    password: z.string().min(8, 'Минимальная длина - 8').max(24, 'Максимальная длина - 24'),
    password_submit: z.string(),
    is_superuser: z.boolean().default(false),
  })
  .refine((val) => val.password === val.password_submit, {
    message: 'Пароли должны совпадать',
    path: ['password_submit'],
  });

export const userLoginValidation = z.object({
  email: z.string().email('Некорректный формат почты'),
  password: z.string(),
});

export const userUpdateValidation = userValidation.omit({ id: true, created_at: true }).extend({
  password: z.string().optional(),
  new_password: z.string().min(8, 'Минимальная длина - 8').max(24, 'Максимальная длина - 24').optional(),
});

export const userResponseUpdateValidation = userUpdateValidation.partial().required({ password: true });
