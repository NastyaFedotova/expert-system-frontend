import { z } from 'zod';

export const mainPageValidation = z.object({
  page: z.coerce.number().nullish(),
  name: z.string().nullish(),
  username: z.string().nullish(),
});

export const systemIdValidation = z.object({
  system_id: z.coerce.number(),
});

export const verifyEmailValidation = z.object({
  verify_code: z.coerce.string({ message: 'Некоректный код' }).length(20, 'Некоректный код'),
});
