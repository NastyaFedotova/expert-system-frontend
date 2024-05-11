import { z } from 'zod';

import {
  attributeValuesNewValidation,
  attributeValuesUpdateValidation,
  attributeValuesValidation,
} from '@/validation/attributeValues';

export type TAttributeValues = z.infer<typeof attributeValuesValidation>;

export type TAttributeValuesUpdate = z.infer<typeof attributeValuesUpdateValidation>;

export type TAttributeValuesNew = z.infer<typeof attributeValuesNewValidation>;
