import { TUser, TUserLogin, TUserRegistration, TUserUpdate } from '@/types/user';

import { patchApiRequest, postApiRequest } from '..';

export const loginUserResponse = async (loginData: TUserLogin) => {
  const { data } = await postApiRequest<TUser, TUserLogin>(`/user/login`, loginData);

  return data;
};

export const registrationUserResponse = async (registrationData: TUserRegistration) => {
  const { data } = await postApiRequest<TUser, TUserRegistration & { is_superuser: boolean }>(`/user/registration`, {
    ...registrationData,
    is_superuser: false,
  });

  return data;
};

export const logoutUserResponse = async () => {
  await postApiRequest(`/user/logout`);
};

export const updateUserResponse = async (updateData: TUserUpdate) => {
  const { data } = await patchApiRequest<TUser, TUserUpdate>(`/user`, updateData);

  return data;
};
