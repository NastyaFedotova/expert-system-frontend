import { TUser, TUserLogin, TUserRegistration } from '@/types/user';

import { postApiRequest } from '..';

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
