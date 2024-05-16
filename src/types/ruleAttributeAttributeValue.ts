import { z } from 'zod';

import {
  ruleAttributeAttributeValueNewValidation,
  ruleAttributeAttributeValueValidation,
  ruleAttributeAttributeValueWithoutRuleNewValidation,
} from '@/validation/ruleAttributeAttributeValue';
export type TRuleAttributeAttributeValue = z.infer<typeof ruleAttributeAttributeValueValidation>;

export type TRuleAttributeAttributeValueNew = z.infer<typeof ruleAttributeAttributeValueNewValidation>;

export type TRuleAttributeAttributeValueWithoutRuleNew = z.infer<
  typeof ruleAttributeAttributeValueWithoutRuleNewValidation
>;
