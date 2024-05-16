import { OPERATOR } from '@/constants';
import { TRuleAttributeAttributeValue } from '@/types/ruleAttributeAttributeValue';
import { TRuleQuestionAnswer } from '@/types/ruleQuestionAnswer';
import { TRule } from '@/types/rules';

export const clausesCheck = ({
  collectedAnswers,
  rules,
}: {
  collectedAnswers: { question_id: number; answer: string }[];
  rules: TRule[];
}): {
  rule_id?: number;
  isMatchFound: boolean;
  ruleAttributeAttributevalueIds: TRuleAttributeAttributeValue[];
  ruleQuestionAnswer: TRuleQuestionAnswer[];
} => {
  rules.forEach((rule) => {
    const clausesGroupMatch: Map<string, boolean> = new Map();

    rule.clauses.forEach((clause) => {
      const question = collectedAnswers.find((answer) => answer.question_id === clause.question_id);
      if (question) {
        const mapValue = clausesGroupMatch.get(clause.logical_group);
        let comparisonResult = true;
        switch (clause.operator) {
          case OPERATOR.EQUAL:
            comparisonResult = question.answer === clause.compared_value;
            break;
          case OPERATOR.NOT_EQUAL:
            comparisonResult = question.answer !== clause.compared_value;
            break;
          case OPERATOR.ABOVE:
            comparisonResult = Number(question.answer) > Number(clause.compared_value);
            break;
          case OPERATOR.BELOW:
            comparisonResult = Number(question.answer) < Number(clause.compared_value);
            break;
          case OPERATOR.NO_LESS_THAN:
            comparisonResult = Number(question.answer) >= Number(clause.compared_value);
            break;
          case OPERATOR.NO_MORE_THAN:
            comparisonResult = Number(question.answer) <= Number(clause.compared_value);
            break;
        }
        if (mapValue) {
          clausesGroupMatch.set(clause.logical_group, mapValue && comparisonResult);
        } else {
          clausesGroupMatch.set(clause.logical_group, comparisonResult);
        }
      }
    });
  });
  return { rule_id: -1, isMatchFound: true, ruleAttributeAttributevalueIds: [], ruleQuestionAnswer: [] };
};
