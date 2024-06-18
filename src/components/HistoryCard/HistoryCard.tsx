'use client';
import React, { useCallback, useState } from 'react';
import Popup from 'reactjs-popup';
import moment from 'moment';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import CloseIcon from '@/icons/CloseIcon';
import { THistoryResult } from '@/types/history';
import { classname } from '@/utils';

import classes from './HistoryCard.module.scss';

export type CardProps = {
  id: number;
  className?: string;
  title: string;
  answered_questions: string;
  results: THistoryResult[];
  started_at: string;
  finished_at: string;
  onClick?: () => void;
};

const cnCard = classname(classes, 'history-card');

const HistoryCard: React.FC<CardProps> = ({
  className,
  id,
  title,
  answered_questions,
  results,
  started_at,
  finished_at,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Popup
      trigger={
        <div className={cnCard() + ` ${className}`} id={String(id)} onClick={onClick}>
          <div className={cnCard('info')}>
            <Text
              tag={TEXT_TAG.span}
              view={TEXT_VIEW.p20}
              weight={TEXT_WEIGHT.medium}
              maxLines={4}
              className={cnCard('title')}
            >
              {title}
            </Text>
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
              {`Отвечено вопросов: ${answered_questions}`}
            </Text>
            <div>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
                Время начала:
              </Text>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
                {moment(started_at).format('DD/MM/YYYY, hh:mm:ss')}
              </Text>
            </div>
            <div>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
                Время окончания:
              </Text>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
                {moment(finished_at).format('DD/MM/YYYY, hh:mm:ss')}
              </Text>
            </div>
            <div>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
                Результаты:
              </Text>
              {results.slice(0, 4).map((result, index) => (
                <Text
                  key={index}
                  tag={TEXT_TAG.span}
                  view={TEXT_VIEW.p16}
                  maxLines={1}
                  color="secondary"
                  title={result.result}
                  className={cnCard('subtitle')}
                >
                  {`${index + 1}. ${result.result}`}
                </Text>
              ))}
            </div>
          </div>
        </div>
      }
      open={isOpen}
      onClose={closePopup}
      onOpen={openPopup}
      modal
      closeOnDocumentClick
      repositionOnResize
      closeOnEscape
    >
      <div className={cnCard('modal')}>
        <CloseIcon className={cnCard('closeIcon')} onClick={closePopup} />
        <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnCard('modal-text')}>
          {title}
        </Text>
        <Text view={TEXT_VIEW.p20} weight={TEXT_WEIGHT.bold} className={cnCard('modal-text')}>
          Полные результаты тестирования
        </Text>

        <ol className={cnCard('modal-scroll')}>
          {results.map((result, index) => (
            <div key={index} className={cnCard('rawWrapper')}>
              <li>
                <Text
                  tag={TEXT_TAG.span}
                  view={TEXT_VIEW.p16}
                  title={`${String(result.percent)}%`}
                  className={cnCard('result')}
                >
                  {result.result}
                </Text>
              </li>
              <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} className={cnCard('result')}>
                {`${result.percent}%`}
              </Text>
            </div>
          ))}
        </ol>
      </div>
    </Popup>
  );
};

export default HistoryCard;
