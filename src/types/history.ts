import { TSystem } from './systems';

export type THistoryResponseParams = {
  user: number;
};

export type THistory = {
  id: number;
  system: TSystem;
  answered_questions: string;
  results: Map<string, number>;
  started_at: string;
  finished_at: string;
};
