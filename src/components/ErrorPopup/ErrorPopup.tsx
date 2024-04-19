import React, { memo } from 'react';
import Popup from 'reactjs-popup';

import ErrorIcon from '@/icons/ErrorIcon';
import { classname } from '@/utils';

import Text from '../Text';

import classes from './ErrorPopup.module.scss';

type ErrorPopupProps = {
  error?: string;
};

const cnPopup = classname(classes, 'errorPopup');

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error }) => {
  return (
    <>
      {error && (
        <Popup
          trigger={<ErrorIcon className={cnPopup('errorIcon')} />}
          on="hover"
          position="top center"
          arrow={true}
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
