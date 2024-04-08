import React, { memo } from 'react';
import ContentLoader from 'react-content-loader';

const CardSkeleton: React.FC<{ classname?: string }> = ({ classname }) => {
  return (
    <ContentLoader
      speed={2}
      width={280}
      height={450}
      viewBox="0 0 280 450"
      backgroundColor="#d9d9d9"
      foregroundColor="#ecebeb"
      className={classname}
    >
      <rect x="0" y="0" rx="8" ry="8" width="280" height="400" />
    </ContentLoader>
  );
};

export default memo(CardSkeleton);
