'use client';
import { z } from 'zod';

import { RUS_LETTERS_ONLY } from '@/constants';

export const systemValidation = z.object({
  id: z.number().positive(),
  user_id: z.number().positive(),
  about: z.string().max(1024, 'Максимальная длина - 1024').nullish(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
  name: z.string().max(128, 'Максимальная длина - 128').regex(RUS_LETTERS_ONLY, 'Только русские буквы'),
  private: z.boolean(),
  image_uri: z.string(),
});

export const systemUpdateValidation = systemValidation
  .pick({ about: true, name: true, private: true })
  .extend({
    image: z
      .custom<FileList>()
      .optional()
      .transform((files) => files?.item(0) ?? null),
    is_image_removed: z.boolean().default(false),
  })
  .partial();

export const systemNewValidation = systemUpdateValidation.required({ name: true, private: true });