import React, { memo, useCallback } from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';

import TrashIcon from '@/icons/TrashIcon';
import { TRuleForm } from '@/types/rules';
import { classname } from '@/utils';

import classes from './ClausesGroup.module.scss';

type ClausesGroupProps = {
  ruleIndex: number;
  clouseGroupIndex: number;
  control: Control<TRuleForm>;
  setValue: UseFormSetValue<TRuleForm>;
};

const cnClausesGroup = classname(classes, 'clauseGroup');

const ClausesGroup: React.FC<ClausesGroupProps> = ({ control, ruleIndex, clouseGroupIndex, setValue }) => {
  const { fields } = useFieldArray({
    control,
    name: `formData.${ruleIndex}.clauses.${clouseGroupIndex}`,
    keyName: 'arrayId',
  });

  const handleDeleteClauseGroup = useCallback(
    () =>
      fields.forEach((_, clauseIndex) =>
        setValue(`formData.${ruleIndex}.clauses.${clouseGroupIndex}.${clauseIndex}.deleted`, true),
      ),
    [clouseGroupIndex, fields, ruleIndex, setValue],
  );
  return (
    <div className={cnClausesGroup()}>
      <TrashIcon width={30} height={30} className={cnClausesGroup('deleteIcon')} onClick={handleDeleteClauseGroup} />
      {fields.map((clause) => (
        <div key={clause.arrayId}>{clause.logical_group}</div>
      ))}
    </div>
  );
};

export default memo(ClausesGroup);
