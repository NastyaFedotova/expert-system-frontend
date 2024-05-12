import { z } from 'zod';

export const attributeValueValidation = z.object({
  id: z.number(),
  attribute_id: z.number(),
  value: z.string().min(1, 'Поле не может быть пустым').max(64, 'Максимальная длина - 64'),
});

export const attributeValueUpdateValidation = attributeValueValidation.omit({ attribute_id: true });

export const attributeValueNewValidation = attributeValueValidation.omit({ id: true });
