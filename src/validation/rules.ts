import { z } from 'zod';

import { clauseForFormValidation, clauseValidation, clauseWithoutRuleNewValidation } from './clauses';
import {
  ruleAttributeAttributeValueValidation,
  ruleAttributeAttributeValueWithoutRuleNewValidation,
} from './ruleAttributeAttributeValue';
import { ruleQuestionAnswerValidation, ruleQuestionAnswerWithoutRuleNewValidation } from './ruleQuestionAnswer';

export const ruleValidation = z.object({
  id: z.number(),
  system_id: z.number(),
  attribute_rule: z.boolean(),
  clauses: z.array(clauseValidation),
  rule_question_answer_ids: z.array(ruleQuestionAnswerValidation),
  rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueValidation),
});

export const ruleNewValidation = ruleValidation.omit({ id: true }).extend({
  clauses: z.array(clauseWithoutRuleNewValidation),
  rule_question_answer_ids: z.array(ruleQuestionAnswerWithoutRuleNewValidation),
  rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueWithoutRuleNewValidation),
});

export const ruleForFormValidation = ruleValidation
  .extend({
    deleted: z.boolean(),
    clauses: z.array(z.array(clauseForFormValidation).min(1)),
    rule_question_answer_ids: z.array(ruleQuestionAnswerValidation.extend({ deleted: z.boolean() })),
    rule_attribute_attributevalue_ids: z.array(ruleAttributeAttributeValueValidation.extend({ deleted: z.boolean() })),
  })
  .refine((val) =>
    !val.deleted ? val.clauses.some((clauseGroup) => clauseGroup.some((clause) => !clause.deleted)) : true,
  )
  .refine((val) =>
    !val.deleted
      ? val.attribute_rule
        ? val.rule_attribute_attributevalue_ids.length > 0
        : val.rule_question_answer_ids.length > 0
      : true,
  );

export const formRuleValidation = z.object({
  formData: z.array(ruleForFormValidation),
});
