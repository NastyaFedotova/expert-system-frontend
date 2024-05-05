import { z } from 'zod';

import {
  userLoginValidation,
  userRegistrationValidation,
  userResponseUpdateValidation,
  userValidation,
} from '@/validation/user';

export type TUser = z.infer<typeof userValidation>;

export type TUserLogin = z.infer<typeof userLoginValidation>;

export type TUserRegistration = z.infer<typeof userRegistrationValidation>;

export type TUserUpdate = z.infer<typeof userResponseUpdateValidation>;
