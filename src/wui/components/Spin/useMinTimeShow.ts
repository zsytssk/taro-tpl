import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/** 当show变为false时有一个最小的时间间隔
 * @param show
 * @param minTime 最小时间间隔 ms
 */
export function useMinTimeShow(show: boolean, minTime = 300) {
  const timeoutRef = useRef<number>();
  const [localShow, setLocalShow] = useState(false);

  useLayoutEffect(() => {
    if (!show) {
      return;
    }
    setLocalShow(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLocalShow(false);
    }, minTime) as unknown as number;
  }, [show, minTime]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return useMemo(() => {
    return localShow || show;
  }, [localShow, show]);
}
