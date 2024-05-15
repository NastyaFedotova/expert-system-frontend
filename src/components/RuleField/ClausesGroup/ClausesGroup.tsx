import React, { memo, useCallback, useMemo } from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import Input from '@/components/Input';
import Text from '@/components/Text';
import { OPERATOR } from '@/constants';
import AddIcon from '@/icons/AddIcon';
import CloseIcon from '@/icons/CloseIcon';
import TrashIcon from '@/icons/TrashIcon';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import ClauseField from './ClauseField';

import classes from './ClausesGroup.module.scss';

type ClausesGroupProps = {
  ruleIndex: number;
  ruleId: number;
  clauseGroupIndex: number;
  control: Control<TRuleForm>;
  setValue: UseFormSetValue<TRuleForm>;
};

const cnClausesGroup = classname(classes, 'clauseGroup');

const ClausesGroup: React.FC<ClausesGroupProps> = ({ control, ruleIndex, ruleId, clauseGroupIndex, setValue }) => {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.clauses.${clauseGroupIndex}`,
    keyName: 'arrayId',
  });

  const handleDeleteClauseGroup = useCallback(() => {
    console.log('ckick');
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
  console.log(fields);
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

  const allDeleted = useMemo(() => fields.every((field) => field.deleted), [fields]);
  console.log(clauseGroupIndex, allDeleted);
  return (
    <>
      {!allDeleted && (
        <div className={cnClausesGroup()}>
          <CloseIcon width={30} height={30} className={cnClausesGroup('delete')} onClick={handleDeleteClauseGroup} />
          <TrashIcon
            width={30}
            height={30}
            className={cnClausesGroup('deleteIcon')}
            onClick={handleDeleteClauseGroup}
          />
          {fields.map((clause) => (
            <>{!clause.deleted && <ClauseField key={clause.arrayId} />}</>
          ))}
          <div className={cnClausesGroup('newClause')} key="newClause" onClick={handleAddClause}>
            <AddIcon width={30} height={30} className={cnClausesGroup('newClause-addIcon')} />
            <Text>Добавить условие</Text>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ClausesGroup);
