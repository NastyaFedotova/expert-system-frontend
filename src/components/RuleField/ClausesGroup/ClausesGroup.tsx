import React, { memo, useCallback, useMemo } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import Text, { TEXT_VIEW } from '@/components/Text';
import { OPERATOR } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import { TClause } from '@/types/clauses';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import ClauseField from './ClauseField';

import classes from './ClausesGroup.module.scss';

type ClausesGroupProps = {
  ruleIndex: number;
  ruleId: number;
  clauseGroupIndex: number;
  lastClauseGroup: boolean;
  control: Control<TRuleForm>;
};

const cnClausesGroup = classname(classes, 'clauseGroup');

const ClausesGroup: React.FC<ClausesGroupProps> = ({
  control,
  ruleIndex,
  ruleId,
  lastClauseGroup,
  clauseGroupIndex,
}) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.clauses.${clauseGroupIndex}`,
    keyName: 'arrayId',
  });

  const handleDeleteClauseGroup = useCallback(() => {
    let offset = 0;
    fields.forEach((clause, clauseIndex) => {
      if (clause.id === -1) {
        remove(clauseIndex - offset);
        offset++;
      } else {
        update(clauseIndex, { ...clause, deleted: true });
      }
    });
  }, [fields, remove, update]);

  const handleAddClause = useCallback(
    () =>
      append({
        id: -1,
        rule_id: ruleId,
        compared_value: '',
        logical_group: fields?.[0]?.logical_group ?? uuidv4(),
        operator: OPERATOR.EQUAL,
        question_id: -1,
        deleted: false,
      }),
    [append, fields, ruleId],
  );

  const handleDeleteClause = useCallback(
    (clause: TClause, clauseIndex: number) => () => {
      if (clause.id === -1) {
        remove(clauseIndex);
      } else {
        update(clauseIndex, { ...clause, deleted: true });
      }
    },
    [remove, update],
  );

  const allDeleted = useMemo(() => fields.every((field) => field.deleted), [fields]);

  return (
    <>
      {!allDeleted && (
        <>
          <div className={cnClausesGroup()}>
            <CloseIcon width={30} height={30} className={cnClausesGroup('delete')} onClick={handleDeleteClauseGroup} />
            {fields.map((clause, clauseIndex) => (
              <>
                {!clause.deleted && (
                  <ClauseField
                    key={clause.arrayId}
                    control={control}
                    ruleIndex={ruleIndex}
                    clauseGroupIndex={clauseGroupIndex}
                    clauseIndex={clauseIndex}
                    deleteClause={handleDeleteClause(clause, clauseIndex)}
                  />
                )}
              </>
            ))}

            <div className={cnClausesGroup('newClause')} key="newClause" onClick={handleAddClause}>
              <AddIcon width={30} height={30} className={cnClausesGroup('newClause-addIcon')} />
              <Text>Добавить условие</Text>
            </div>
          </div>{' '}
          {!lastClauseGroup && (
            <Text view={TEXT_VIEW.p20} className={cnClausesGroup('or')}>
              Или:
            </Text>
          )}
        </>
      )}
    </>
  );
};

export default memo(ClausesGroup);
