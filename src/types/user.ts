export type TUser = {
  id: number;
  email: string;
  username: string;
  created_at: string;
  first_name: string;
  last_name: string;
};

export type TUserLogin = {
  email: string;
  password: string;
};

export type TUserRegistration = {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type TUserUpdate = {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  new_password?: string;
};
