import { z } from 'zod';

export const ruleQuestionAnswerValidation = z.object({
  id: z.number(),
  rule_id: z.number(),
  question_id: z.number(),
  answer_id: z.number(),
});

export const ruleQuestionAnswerNewValidation = ruleQuestionAnswerValidation.omit({
  id: true,
});
