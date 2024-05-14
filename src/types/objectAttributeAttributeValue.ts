import { z } from 'zod';

import {
  objectAttributeAttributeValueNewValidation,
  objectAttributeAttributeValueValidation,
} from '@/validation/objectAttributeAttributeValue';

export type TObjectAttributeAttributeValueValidation = z.infer<typeof objectAttributeAttributeValueValidation>;

export type TObjectAttributeAttributeValueNew = z.infer<typeof objectAttributeAttributeValueNewValidation>;
