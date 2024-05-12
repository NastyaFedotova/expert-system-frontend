import { z } from 'zod';

export const objectAttributeAttributeValueValidation = z.object({
  id: z.number(),
  object_id: z.number(),
  attribute_id: z.number(),
  attribute_value_id: z.number(),
});

export const objectAttributeAttributeValueNewValidation = objectAttributeAttributeValueValidation.omit({
  id: true,
});
