import { z } from 'zod';

export const ruleQuestionAnswerValidation = z.object({
  id: z.number(),
  rule_id: z.number(),
  question_id: z.number().positive(),
  answer_id: z.number().positive(),
});

export const ruleQuestionAnswerNewValidation = ruleQuestionAnswerValidation.omit({
  id: true,
});

export const ruleQuestionAnswerWithoutRuleNewValidation = ruleQuestionAnswerNewValidation.omit({
  rule_id: true,
});
