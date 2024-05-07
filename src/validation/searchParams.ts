import { z } from 'zod';

export const mainPageValidation = z.object({
  page: z.coerce.number().nullish(),
  name: z.string().nullish(),
  username: z.string().nullish(),
});
