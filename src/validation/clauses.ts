import { z } from 'zod';

import { OPERATOR } from '@/constants';

export const clauseValidation = z.object({
  id: z.number(),
  rule_id: z.number(),
  compared_value: z.string().min(1, 'Поле не может быть пустым').max(64, 'Максимальная длина - 64'),
  logical_group: z.string(),
  operator: z.nativeEnum(OPERATOR),
  question_id: z.number(),
});

export const clauseNewValidation = clauseValidation.omit({
  id: true,
});

export const clauseUpdateValidation = clauseValidation.omit({ rule_id: true });

export const clauseForFormValidation = clauseValidation.extend({ deleted: z.boolean().default(false) });
