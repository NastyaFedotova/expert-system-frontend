import React from 'react';

import Icon, { IconProps } from '../Icon';

const DownloadIcon: React.FC<IconProps> = (props) => (
  <Icon {...props} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 21H9C6.17157 21 4.75736 21 3.87868 20.1213C3 19.2426 3 17.8284 3 15M21 15C21 17.8284 21 19.2426 20.1213 20.1213C19.8215 20.4211 19.4594 20.6186 19 20.7487"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

export default DownloadIcon;
