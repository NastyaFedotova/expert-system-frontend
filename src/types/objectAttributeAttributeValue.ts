import { z } from 'zod';

import {
  objectAttributeAttributeValueNewValidation,
  objectAttributeAttributeValueValidation,
} from '@/validation/objectAttributeAttributeValue';

export type TObjectAttributeAttributeValueValidation = z.infer<typeof objectAttributeAttributeValueValidation>;

export type TObjectAttributeAttributeValueNewValidation = z.infer<typeof objectAttributeAttributeValueNewValidation>;
