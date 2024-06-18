import Cookies from 'js-cookie';

import { TErrorResponse } from '@/types/error';
import { ForgotPassword, ResetPassword, TUser, TUserLogin, TUserRegistration, TUserUpdate } from '@/types/user';

import { getApiRequest, patchApiRequest, postApiRequest } from '..';

export const loginUserResponse = async (loginData: TUserLogin): Promise<TUser> => {
  const { data } = await postApiRequest<TUser, TUserLogin>(`/user/login`, loginData);

  const session_key = Cookies.get('session_id');
  if (!session_key) {
    const err: TErrorResponse = {
      error: 'Не удалось авторизоваться',
      status: 'Not HTTP error',
    };
    throw JSON.stringify(err);
  }

  return data;
};

export const registrationUserResponse = async (registrationData: TUserRegistration): Promise<TUser> => {
  Cookies.remove('session_id');
  const { data } = await postApiRequest<TUser, TUserRegistration>(`/user/registration`, registrationData);

  return data;
};

export const logoutUserResponse = async () => {
  await postApiRequest(`/user/logout`);
};

export const updateUserResponse = async (updateData: TUserUpdate): Promise<TUser> => {
  const { data } = await patchApiRequest<TUser, TUserUpdate>(`/user`, updateData);

  return data;
};

export const userResponse = async (): Promise<TUser> => {
  const { data } = await getApiRequest<TUser>(`/user`);
  return data;
};

export const emailVerifyPost = async (verify_code: string) => {
  const { data } = await postApiRequest<TUser, void>(`/user/verifyemail/${verify_code}`);
  return data;
};

export const forgotPasswordPost = async (params: ForgotPassword) => {
  Cookies.remove('session_id');
  const { data } = await postApiRequest<unknown, ForgotPassword>(`/user/forgotpassword`, params);
  return data;
};

export const resetPasswordPost = async (params: ResetPassword & { verify_code: string }) => {
  Cookies.remove('session_id'); //добавить на этапе загрузки страницы
  const { verify_code, ...passwords } = params;
  const { data } = await postApiRequest<unknown, ResetPassword>(`/user/resetpassword/${verify_code}`, passwords);
  return data;
};
