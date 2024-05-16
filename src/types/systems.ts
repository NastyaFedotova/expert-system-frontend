import { z } from 'zod';

import {
  systemNewValidation,
  systemTestvalidation,
  systemUpdateValidation,
  systemValidation,
} from '@/validation/system';

export type TSystemRequestParams = {
  user_id?: number;
  name?: string;
  username?: string;
  page?: number;
  per_page?: number;
  all_types?: boolean;
};

export type TSystem = z.infer<typeof systemValidation>;

export type TSystemNew = z.infer<typeof systemNewValidation>;

export type TSystemUpdate = z.infer<typeof systemUpdateValidation>;

export type TSystemUpdateBefore = z.input<typeof systemUpdateValidation>;

export type TSystemDeleteResponseParams = {
  system_id: number;
  password: string;
};

export type TSystemsWithPage = {
  systems: TSystem[];
  pages: number;
};

export type TSystemTest = z.infer<typeof systemTestvalidation>;
