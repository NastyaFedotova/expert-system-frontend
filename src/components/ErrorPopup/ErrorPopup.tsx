import React, { memo } from 'react';
import Popup from 'reactjs-popup';
import { PopupPosition } from 'reactjs-popup/dist/types';

import ErrorIcon from '@/icons/ErrorIcon';
import { classname } from '@/types/utils';

import Text from '../Text';

import classes from './ErrorPopup.module.scss';

type ErrorPopupProps = {
  error?: string;
  position?: PopupPosition;
  arrow?: boolean;
  offsetY?: number;
};

const cnPopup = classname(classes, 'errorPopup');

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error, position = 'top right', arrow = false, offsetY = 4 }) => {
  return (
    <>
      {error && (
        <Popup
          trigger={<ErrorIcon className={cnPopup('errorIcon')} />}
          on="hover"
          position={position}
          arrow={arrow}
          offsetY={offsetY}
          arrowStyle={{ color: '#d32f2f' }}
        >
          <div className={cnPopup()}>
            <Text className={cnPopup('text')}>{error}</Text>
          </div>
        </Popup>
      )}
    </>
  );
};

export default memo(ErrorPopup);
