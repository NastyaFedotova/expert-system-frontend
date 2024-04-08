'use client';
import React, { memo, useCallback } from 'react';

import { ArrowLeftIcon } from '@/icons';
import { useReposPageStore } from '@/providers/storeProvider';
import { classname } from '@/utils';

import Text, { TEXT_VIEW } from '../Text';

import classes from './PageStepper.module.scss';

export type PageStepperProps = {
  classname?: string;
};

const cnPageStepper = classname(classes, 'pagestepper');

const PageStepper: React.FC<PageStepperProps> = ({ classname }) => {
  const { currentPage, pagesCount, setCurrentPage } = useReposPageStore((store) => store);
  const getPageHandle = useCallback((page: number) => () => setCurrentPage(page), [setCurrentPage]);
  return (
    <>
      {pagesCount > 1 && (
        <div className={cnPageStepper() + ` ${classname}`}>
          <ArrowLeftIcon
            className={cnPageStepper('icon', { left: true, disabled: 1 === currentPage })}
            onClick={getPageHandle(currentPage - 1)}
          />
          <span onClick={getPageHandle(1)} key={1}>
            <Text view={TEXT_VIEW.p18} className={cnPageStepper('page', { currentPage: currentPage === 1 })}>
              1
            </Text>
          </span>
          {currentPage > 4 && pagesCount > 1 && (
            <Text view={TEXT_VIEW.p18} className={cnPageStepper('dots')}>
              ...
            </Text>
          )}
          {[...Array(pagesCount).keys()].map((page) =>
            page > 0 &&
            page < pagesCount - 1 &&
            !(currentPage > 4 && page < Math.min(currentPage - 2, pagesCount - 5)) &&
            !(currentPage < pagesCount - 3 && page > Math.max(currentPage, 4)) ? (
              <span key={page} onClick={getPageHandle(page + 1)}>
                <Text view={TEXT_VIEW.p18} className={cnPageStepper('page', { currentPage: page + 1 === currentPage })}>
                  {page + 1}
                </Text>
              </span>
            ) : (
              <span key={page}></span>
            ),
          )}
          {currentPage < pagesCount - 3 && (
            <Text view={TEXT_VIEW.p18} className={cnPageStepper('dots')}>
              ...
            </Text>
          )}
          <span onClick={getPageHandle(pagesCount)} key={pagesCount}>
            <Text view={TEXT_VIEW.p18} className={cnPageStepper('page', { currentPage: pagesCount === currentPage })}>
              {pagesCount}
            </Text>
          </span>
          <ArrowLeftIcon
            className={cnPageStepper('icon', { right: true, disabled: currentPage === pagesCount })}
            onClick={getPageHandle(currentPage + 1)}
          />
        </div>
      )}
    </>
  );
};

export default memo(PageStepper);
