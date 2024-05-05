export enum SYSTEMS {
  GET = 'systems-get',
  GET_USER = 'users-systems',
  RETRIEVE = 'systems-retrieve',
  POST = 'systems-post',
}

export enum HISTORIES {
  GET = 'histories-get',
  GET_USER = 'users-histories',
  RETRIEVE = 'histories-retrieve',
  POST = 'histories-post',
}

export enum USER {
  COOKIE = 'user-by-cookie-login',
}

export const RUS_LETTERS_ONLY = new RegExp(/[^а-яА-Я]/);
