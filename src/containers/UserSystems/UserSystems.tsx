import React, { memo } from 'react';

import { classname } from '@/utils';

import classes from './UserSystems.module.scss';

const cnUserProfile = classname(classes, 'user-systems');

export const UserSystems: React.FC = () => {
  return <div className={cnUserProfile()}></div>;
};

export default memo(UserSystems);
