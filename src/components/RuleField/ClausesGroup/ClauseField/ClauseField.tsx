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

import classes from './ClauseField.module.scss';

type ClauseFieldProps = {};

const cnClauseField = classname(classes, 'clauseGroup');

const ClauseField: React.FC<ClauseFieldProps> = ({}) => {
  return <div></div>;
};

export default memo(ClauseField);
