import { z } from 'zod';

import {
  attributeNewValidation,
  attributeValidation,
  attributeWithAttributeValuesNewValidation,
  attributeWithAttributeValuesValidation,
} from '@/validation/attributes';

export type TAttribute = z.infer<typeof attributeValidation>;

export type TAttributeNew = z.infer<typeof attributeNewValidation>;

export type TAttributeWithAttributeValues = z.infer<typeof attributeWithAttributeValuesValidation>;

export type TAttributeWithAttributeValuesNew = z.infer<typeof attributeWithAttributeValuesNewValidation>;
