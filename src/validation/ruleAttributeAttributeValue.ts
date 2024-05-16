import { z } from 'zod';

export const ruleAttributeAttributeValueValidation = z.object({
  id: z.number(),
  rule_id: z.number(),
  attribute_id: z.number().positive(),
  attribute_value_id: z.number().positive(),
});

export const ruleAttributeAttributeValueNewValidation = ruleAttributeAttributeValueValidation.omit({
  id: true,
});
