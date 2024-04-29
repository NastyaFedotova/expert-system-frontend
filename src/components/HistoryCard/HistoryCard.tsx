'use client';
import React, { memo } from 'react';
import moment from 'moment';

import Text, { TEXT_TAG, TEXT_VIEW, TEXT_WEIGHT } from '@/components/Text';
import { classname } from '@/utils';

import classes from './HistoryCard.module.scss';

export type CardProps = {
  id: number;
  className?: string;
  title: string;
  answered_questions: string;
  results: Map<string, number>;
  started_at: string;
  finished_at: string;
  onClick: () => void;
};

const cnCard = classname(classes, 'history-card');

const HistoryCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, id, title, answered_questions, results, started_at, finished_at, onClick }, ref) => {
    return (
      <div className={cnCard() + ` ${className}`} id={String(id)} ref={ref} onClick={onClick}>
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
          <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
            {`Время начала: ${moment(started_at).format('hh:mm:ss, DD/MM/YY')}`}
          </Text>
          <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
            {`Время окончания: ${moment(finished_at).format('hh:mm:ss, DD/MM/YY')}`}
          </Text>
          <div>
            <Text tag={TEXT_TAG.span} view={TEXT_VIEW.p16} color="secondary" className={cnCard('subtitle')}>
              Результаты:
            </Text>

            {Object.entries(results)
              .sort((a, b) => b[1] - a[1])
              .splice(0, 4)
              .map((result, index) => (
                <Text
                  key={index}
                  tag={TEXT_TAG.span}
                  view={TEXT_VIEW.p16}
                  maxLines={1}
                  color="secondary"
                  title={result[0]}
                  className={cnCard('subtitle')}
                >
                  {`${index + 1}. ${result[0]}`}
                </Text>
              ))}
          </div>
        </div>
      </div>
    );
  },
);

export default memo(HistoryCard);
