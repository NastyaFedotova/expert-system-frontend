import { number, z } from 'zod';

import { attributeValuesValidation } from './attributeValues';

export const attributeValidation = z.object({
  id: z.number(),
  system_id: number().positive(),
  name: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
});

export const attributeWithAttributeValuesValidation = attributeValidation.extend({
  values: z.array(attributeValuesValidation),
});

export const attributeNewValidation = attributeValidation.omit({ id: true });

export const attributeWithAttributeValuesNewValidation = attributeNewValidation.extend({
  values_name: z.array(z.string().max(128, 'Максимальная длина - 128')),
});

export const formAttrWithValuesValidation = z.object({ formData: z.array(attributeWithAttributeValuesValidation) });

export const attributeUpdateValidation = attributeValidation.omit({ system_id: true });
