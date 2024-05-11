import { z } from 'zod';

import { answersNewValidation, answersUpdateValidation, answersValidation } from '@/validation/answers';

export type TAnswers = z.infer<typeof answersValidation>;

export type TAnswersUpdate = z.infer<typeof answersUpdateValidation>;

export type TAnswersNew = z.infer<typeof answersNewValidation>;
