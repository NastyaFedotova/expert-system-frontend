import { z } from 'zod';

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

export const ruleForFormValidation = ruleValidation
  .extend({
    deleted: z.boolean(),
    clauses: z.array(z.array(clauseForFormValidation).min(1)),
    rule_question_answer_ids: z.array(ruleQuestionAnswerValidation.extend({ deleted: z.boolean() })),
    rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueValidation.extend({ deleted: z.boolean() })),
  })
  .refine((val) => val.clauses.some((clauseGroup) => clauseGroup.some((clause) => !clause.deleted)))
  .refine((val) =>
    val.attribute_rule ? val.rule_attribute_attributevalue_ids.length > 0 : val.rule_question_answer_ids.length > 0,
  );

export const formRuleValidation = z.object({
  formData: z.array(ruleForFormValidation),
});
