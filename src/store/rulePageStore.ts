import { create } from 'zustand';

import { TAttributeWithAttributeValues } from '@/types/attributes';
import { TQuestionWithAnswers } from '@/types/questions';

type RulePageStates = {
  questions: TQuestionWithAnswers[];
  attributes: TAttributeWithAttributeValues[];
};

type RulePageActions = {
  setQuestions: (questions: TQuestionWithAnswers[]) => void;
  setAttributes: (attributes: TAttributeWithAttributeValues[]) => void;
};

const initialState: RulePageStates = {
  questions: [],
  attributes: [],
};

export type RulePageStore = RulePageStates & RulePageActions;

const useRulePageStore = create<RulePageStore>((set) => ({
  ...initialState,
  setQuestions: (questions) => set({ questions }),
  setAttributes: (attributes) => set({ attributes }),
}));

export default useRulePageStore;
