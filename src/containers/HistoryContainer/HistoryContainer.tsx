import React, { memo, useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import { useQuery } from '@tanstack/react-query';

import { getHistories } from '@/api/services/history';
import { CardSkeleton } from '@/components/CardSkeleton';
import HistoryCard from '@/components/HistoryCard';
import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import { HISTORIES } from '@/constants';
import CloseIcon from '@/icons/CloseIcon';
import useUserStore from '@/store/userStore';
import { classname } from '@/utils';

import classes from './HistoryContainer.module.scss';

const cnHistory = classname(classes, 'history');

const HistoryContainer: React.FC = () => {
  const user = useUserStore((store) => store.user);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [HISTORIES.GET, { user: user?.id }],
    queryFn: async () => await getHistories({ user: user?.id ?? -1 }),
    enabled: !!user,
  });

  const [isOpen, setIsOpen] = useState(-1);

  const openPopup = useCallback(
    (index: number) => () => {
      setIsOpen(index);
    },
    [],
  );

  const closePopup = useCallback(() => {
    setIsOpen(-1);
  }, []);

  return (
    <div className={cnHistory()}>
      {!!data?.length &&
        isSuccess &&
        data.map((system, index) => (
          <Popup
            key={index}
            trigger={<HistoryCard key={index} {...system} title={system.system.name} onClick={openPopup(index)} />}
            open={isOpen === index}
            onClose={closePopup}
            onOpen={openPopup(index)}
            modal
            closeOnDocumentClick
            repositionOnResize
            closeOnEscape
          >
            <div className={cnHistory('modal')}>
              <CloseIcon className={cnHistory('closeIcon')} onClick={closePopup} />
              <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnHistory('modal-text')}>
                {system.system.name}
              </Text>
              <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnHistory('modal-text')}>
                Полные результаты тестирования
              </Text>

              <ol className={cnHistory('modal-scroll')}>
                {Object.entries(system.results)
                  .sort((a, b) => b[1] - a[1])
                  .map((result, index) => (
                    <div key={index} className={cnHistory('rawWrapper')}>
                      <li>
                        <Text
                          tag={TEXT_TAG.span}
                          view={TEXT_VIEW.p16}
                          title={`${String(result[1])}%`}
                          className={cnHistory('result')}
                        >
                          {result[0]}
                        </Text>
                      </li>
                      <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} className={cnHistory('result')}>
                        {`${result[1]}%`}
                      </Text>
                    </div>
                  ))}
              </ol>
            </div>
          </Popup>
        ))}
      {isLoading && [...Array(6).keys()].map((index) => <CardSkeleton key={index} />)}
    </div>
  );
};

export default memo(HistoryContainer);
