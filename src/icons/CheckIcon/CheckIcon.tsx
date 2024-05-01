import React from 'react';

import Icon, { IconProps } from '../Icon';

const CheckIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => (
  <Icon {...props} ref={ref} viewBox="0 0 24 24" fill="none">
    <path
      fill="currentColor"
      stroke="currentColor"
      color="currentColor"
      d="m 14.653 11.333 a 1109.467 1109.467 0 0 1 -4.7 5.092 l -0.093 0.085 l -2.553 -2.777 c -1.404 -1.528 -2.568 -2.772 -2.586 -2.765 c -0.047 0.017 -1.434 1.287 -1.438 1.315 c -0.005 0.037 6.556 7.157 6.594 7.157 c 0.044 0 10.823 -11.712 10.823 -11.76 c 0 -0.019 -0.279 -0.291 -0.62 -0.603 l -0.72 -0.66 l -0.1 -0.092 l -4.607 5.008"
    />
  </Icon>
));

export default CheckIcon;
