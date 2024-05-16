import { TErrorResponse } from '@/types/error';

const errorParser = (error: unknown): TErrorResponse => {
  let object = {};
  try {
    object = new Object(JSON.parse(error as string));
  } catch {
    object = error as string;
  }
  const err: TErrorResponse = {
    error: object.toLocaleString(),
    status: 'Unknown error',
  };

  if ('error' in object) {
    err.error = object.error as string;
  }

  if ('extra' in object) {
    err.extra = object.extra as string;
  }

  if ('status' in object) {
    err.status = object.status as string;
  }
  console.log(err);
  return err;
};

export default errorParser;
