import { z } from 'zod';

import { formRuleValidation, ruleForFormValidation, ruleNewValidation, ruleValidation } from '@/validation/rules';

export type TRule = z.infer<typeof ruleValidation>;

export type TRuleNew = z.infer<typeof ruleNewValidation>;

export type TRuleForForm = z.infer<typeof ruleForFormValidation>;

export type TRuleForm = z.infer<typeof formRuleValidation>;
