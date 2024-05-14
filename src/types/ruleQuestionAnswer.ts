import { z } from 'zod';

import { ruleQuestionAnswerNewValidation, ruleQuestionAnswerValidation } from '@/validation/ruleQuestionAnswer';

export type TRuleQuestionAnswer = z.infer<typeof ruleQuestionAnswerValidation>;

export type TRuleQuestionAnswerNew = z.infer<typeof ruleQuestionAnswerNewValidation>;
