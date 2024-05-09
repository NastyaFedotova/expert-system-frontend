import { z } from 'zod';

import { attributeValuesValidation } from '@/validation/attributeValues';

export type TAttributeValues = z.infer<typeof attributeValuesValidation>;
