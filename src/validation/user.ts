import { z } from 'zod';

import { RUS_LETTERS_ONLY } from '@/constants';

export const userValidation = z.object({
  id: z.number().positive(),
  email: z.string().email('Некорректный формат почты').max(64, 'Максимальная длина - 64'),
  username: z.string().max(16, 'Максимальная длина - 16'),
  created_at: z.string().datetime({ offset: true }),
  first_name: z.string().regex(RUS_LETTERS_ONLY, 'Только русские буквы').max(16, 'Максимальная длина - 16'),
  last_name: z.string().regex(RUS_LETTERS_ONLY, 'Только русские буквы').max(16, 'Максимальная длина - 16'),
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

export const userResponseUpdateValidation = userValidation
  .omit({ id: true, created_at: true })
  .extend({
    password: z.string(),
    new_password: z.string().max(24, 'Максимальная длина - 24'),
  })
  .partial()
  .required({ password: true });

export const userUpdateValidation = userResponseUpdateValidation
  .required()
  .partial({ new_password: true, password: true })
  .refine((val) => (val.new_password?.length ? val.new_password?.length >= 8 : true), {
    message: 'Минимальная длина - 8',
    path: ['new_password'],
  });
