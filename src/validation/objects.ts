import { z } from 'zod';

import { attributeValueValidation } from './attributeValues';
import {
  objectAttributeAttributeValueNewValidation,
  objectAttributeAttributeValueValidation,
} from './objectAttributeAttributeValue';

export const objectValidation = z.object({
  id: z.number(),
  system_id: z.number(),
  name: z.string().min(1, 'Поле не может быть пустым').max(128, 'Максимальная длина - 128'),
});

export const objectWithIdsValidation = objectValidation.extend({
  object_attribute_attributevalue_ids: z.array(objectAttributeAttributeValueValidation),
});

export const objectUpdateValidation = objectValidation.omit({ system_id: true });

export const objectWithIdsNewValidation = objectValidation.omit({ id: true }).extend({
  object_attribute_attributevalue_ids: z.array(objectAttributeAttributeValueNewValidation.omit({ object_id: true })),
});

export const objectWithAttrValuesValidation = objectValidation.extend({
  attributesValues: z.array(attributeValueValidation),
});

export const formObjectWithAttrValuesValidation = z.object({
  formData: z.array(objectWithAttrValuesValidation),
});
