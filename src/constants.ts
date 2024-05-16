export enum SYSTEMS {
  GET = 'systems-get',
  GET_USER = 'users-systems',
  RETRIEVE = 'systems-retrieve',
  POST = 'systems-post',
  TEST = 'system-test',
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

export enum RULES {
  GET = 'rules-with-clauses-get',
}

export const RUS_LETTERS_ONLY = new RegExp(/[а-яА-Я]/);

export enum OPERATOR {
  EQUAL = 'Equal',
  NOT_EQUAL = 'NotEqual',
  BELOW = 'Below',
  ABOVE = 'Above',
  NO_MORE_THEN = 'NoMoreThen',
  NO_LESS_THEN = 'NoLessThen',
}

type Option = { value: OPERATOR; label: string };

export const operatorOptions: Option[] = [
  { value: OPERATOR.EQUAL, label: '=' },
  { value: OPERATOR.NOT_EQUAL, label: '!=' },
  { value: OPERATOR.BELOW, label: '<' },
  { value: OPERATOR.ABOVE, label: '>' },
  { value: OPERATOR.NO_MORE_THEN, label: '<=' },
  { value: OPERATOR.NO_LESS_THEN, label: '>=' },
];
