import { z } from 'zod';

import {
  formObjectWithAttrValuesValidation,
  objectUpdateValidation,
  objectValidation,
  objectWithAttrValuesValidation,
  objectWithIdsNewValidation,
  objectWithIdsValidation,
} from '@/validation/objects';

export type TObject = z.infer<typeof objectValidation>;

export type TObjectWithIds = z.infer<typeof objectWithIdsValidation>;

export type TObjectUpdate = z.infer<typeof objectUpdateValidation>;

export type TObjectWithIdsNew = z.infer<typeof objectWithIdsNewValidation>;

export type TObjectWithAttrValues = z.infer<typeof objectWithAttrValuesValidation>;

export type TObjectWithAttrValuesForm = z.infer<typeof formObjectWithAttrValuesValidation>;
