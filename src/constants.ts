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

export enum ATTRIBUTES {
  GET = 'attributes-with-attributeValues-get',
}

export enum QUESTIONS {
  GET = 'questions-with-answers-get',
}

export enum OBJECTS {
  GET = 'objects-with-attributeValues-get',
}

export const RUS_LETTERS_ONLY = new RegExp(/[^а-яА-Я]/);
