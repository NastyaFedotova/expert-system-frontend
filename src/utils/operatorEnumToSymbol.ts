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
    case OPERATOR.NO_LESS_THEN:
      return '>=';
    case OPERATOR.NO_MORE_THEN:
      return '<=';
  }
};

export default operatorToSymbol;
