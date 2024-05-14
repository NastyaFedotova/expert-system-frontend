import { z } from 'zod';

import {
  clauseForFormValidation,
  clauseNewValidation,
  clauseUpdateValidation,
  clauseValidation,
} from '@/validation/clauses';

export type TClause = z.infer<typeof clauseValidation>;

export type TClauseNew = z.infer<typeof clauseNewValidation>;

export type TClauseUpdate = z.infer<typeof clauseUpdateValidation>;

export type TClauseForForm = z.infer<typeof clauseForFormValidation>;
