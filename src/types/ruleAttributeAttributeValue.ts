import { z } from 'zod';

import {
  ruleAttributeAttributeValueNewValidation,
  ruleAttributeAttributeValueValidation,
} from '@/validation/ruleAttributeAttributeValue';

export type TRuleAttributeAttributeValue = z.infer<typeof ruleAttributeAttributeValueValidation>;

export type TRuleAttributeAttributeValueNew = z.infer<typeof ruleAttributeAttributeValueNewValidation>;
