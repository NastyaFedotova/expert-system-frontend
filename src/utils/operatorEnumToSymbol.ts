import { OPERATOR } from '@/constants';

const operatorToSymbol = (oparator: OPERATOR) => {
  switch (oparator) {
    case OPERATOR.ABOVE:
      return '>';
    case OPERATOR.BELOW:
      return '<';
    case OPERATOR.EQUAL:
      return '=';
    case OPERATOR.NOT_EQUAL:
      return '!=';
    case OPERATOR.NO_LESS_THAN:
      return '>=';
    case OPERATOR.NO_MORE_THAN:
      return '<=';
  }
};

export default operatorToSymbol;
