import { number, z } from 'zod';

import { attributeValueValidation } from './attributeValues';

export const attributeValidation = z.object({
  id: z.number(),
  system_id: number().positive(),
  name: z.string().min(1, 'Поле не может быть пустым').max(64, 'Максимальная длина - 64'),
});

export const attributeWithAttributeValuesValidation = attributeValidation.extend({
  values: z.array(attributeValueValidation),
});

export const attributeWithAttributeValuesNewValidation = attributeValidation.omit({ id: true }).extend({
  values_name: z.array(z.string().min(1, 'Поле не может быть пустым').max(64, 'Максимальная длина - 64')),
});

export const formAttrWithValuesValidation = z.object({ formData: z.array(attributeWithAttributeValuesValidation) });

export const attributeUpdateValidation = attributeValidation.omit({ system_id: true });
