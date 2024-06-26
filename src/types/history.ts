import { TSystem } from './systems';

export type THistoryResult = {
  result: string;
  percent: number;
};

export type THistoryResponseParams = {
  user: number;
};

export type THistory = {
  id: number;
  system: TSystem;
  answered_questions: string;
  results: { [key: string]: number };
  started_at: string;
  finished_at: string;
};

export type THistoryNormilize = {
  id: number;
  system: TSystem;
  answered_questions: string;
  results: THistoryResult[];
  started_at: string;
  finished_at: string;
};

export type THistoryNew = {
  system_id: number;
  user_id: number;
  results: { [key: string]: number };
  answered_questions: string;
};
