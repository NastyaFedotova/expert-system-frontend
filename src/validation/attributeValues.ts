import { z } from 'zod';

export const attributeValuesValidation = z.object({
  id: z.number(),
  attribute_id: z.number(),
  value: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
});

export const attributeValuesUpdateValidation = attributeValuesValidation.omit({ attribute_id: true });

export const attributeValuesNewValidation = attributeValuesValidation.omit({ id: true });
