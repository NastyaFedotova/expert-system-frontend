import { z } from 'zod';

import { answerValidation } from './answers';
import { attributeValueValidation } from './attributeValues';
import { clauseForFormValidation, clauseNewValidation, clauseValidation } from './clauses';
import {
  ruleAttributeAttributeValueNewValidation,
  ruleAttributeAttributeValueValidation,
} from './ruleAttributeAttributeValue';
import { ruleQuestionAnswerNewValidation, ruleQuestionAnswerValidation } from './ruleQuestionAnswer';

export const ruleValidation = z.object({
  id: z.number(),
  system_id: z.number(),
  attribute_rule: z.boolean(),
  clauses: z.array(clauseValidation),
  rule_question_answer_ids: z.array(ruleQuestionAnswerValidation),
  rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueValidation),
});

export const ruleNewValidation = ruleValidation.extend({
  clauses: z.array(clauseNewValidation),
  rule_question_answer_ids: z.array(ruleQuestionAnswerNewValidation),
  rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueNewValidation),
});

export const ruleForFormValidation = ruleValidation.extend({
  deleted: z.boolean().default(true),
  clauses: z.array(z.array(clauseForFormValidation)),
  rule_question_answer_ids: z.array(answerValidation),
  rule_attribute_attributevalue_ids: z.array(attributeValueValidation),
});

export const formRuleValidation = z.object({
  formData: z.array(ruleForFormValidation),
});
