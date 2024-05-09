import { RefObject, useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, hide: () => void): void => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as HTMLDivElement)) {
        hide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, hide]);
};
