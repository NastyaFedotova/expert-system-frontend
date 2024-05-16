import { z } from 'zod';

import {
  ruleQuestionAnswerNewValidation,
  ruleQuestionAnswerValidation,
  ruleQuestionAnswerWithoutRuleNewValidation,
} from '@/validation/ruleQuestionAnswer';

export type TRuleQuestionAnswer = z.infer<typeof ruleQuestionAnswerValidation>;

export type TRuleQuestionAnswerNew = z.infer<typeof ruleQuestionAnswerNewValidation>;

export type TRuleQuestionAnswerNewWithoutRuleNew = z.infer<typeof ruleQuestionAnswerWithoutRuleNewValidation>;
