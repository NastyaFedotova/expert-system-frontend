import React from 'react';

import Icon, { IconProps } from '../Icon';

const UploadIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} viewBox="2 2 20 20" fill="none">
    <path
      d="M12 19V12M12 12L9.75 14.3333M12 12L14.25 14.3333M6.6 17.8333C4.61178 17.8333 3 16.1917 3 14.1667C3 12.498 4.09438 11.0897 5.59198 10.6457C5.65562 10.6268 5.7 10.5675 5.7 10.5C5.7 7.46243 8.11766 5 11.1 5C14.0823 5 16.5 7.46243 16.5 10.5C16.5 10.5582 16.5536 10.6014 16.6094 10.5887C16.8638 10.5306 17.1284 10.5 17.4 10.5C19.3882 10.5 21 12.1416 21 14.1667C21 16.1917 19.3882 17.8333 17.4 17.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.5"
    />
  </Icon>
);

export default UploadIcon;
