import { z } from 'zod';

import {
  attributeUpdateValidation,
  attributeWithAttributeValuesNewValidation,
  attributeWithAttributeValuesValidation,
} from '@/validation/attributes';

export type TAttributeWithAttributeValues = z.infer<typeof attributeWithAttributeValuesValidation>;

export type TAttributeWithAttributeValuesNew = z.infer<typeof attributeWithAttributeValuesNewValidation>;

export type TAttributeUpdate = z.infer<typeof attributeUpdateValidation>;
