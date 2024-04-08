import { useEffect, useMemo, useRef, useState } from 'react';

export const useElementOnScreen = <T extends HTMLElement>(options: IntersectionObserverInit) => {
  const [isVisible, setIsVisible] = useState(true);
  const targetRef = useRef<T>(null);
  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options),
    [options],
  );

  useEffect(() => {
    const current = targetRef.current as Element;
    if (current) {
      observer.observe(current);
      return () => observer.unobserve(current);
    }
  }, [observer]);
  return { isVisible, targetRef };
};
