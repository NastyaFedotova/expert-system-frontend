import React from 'react';

import Icon, { IconProps } from '../Icon';

const ArrowBackIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none">
    <path
      d="M 4 12 L 20 12 M 4 12 L 8 16 M 4 12 L 8 8"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default ArrowBackIcon;
