import { useEffect, useMemo, useRef, useState } from 'react';

/** 在isIn=false之后+transTime返回false */
export function useDelayShow(show: boolean, delayTime = 300) {
  const hasEnterRef = useRef(false);
  const [localShow, setLocalShow] = useState(show);

  useEffect(() => {
    if (show) {
      setLocalShow(true);
    }
  }, [show]);

  useEffect(() => {
    if (!hasEnterRef.current && !show) {
      return;
    }

    hasEnterRef.current = show;
    const timeout = setTimeout(() => {
      if (!show) {
        setLocalShow(false);
      }
    }, delayTime);

    return () => {
      clearTimeout(timeout);
    };
  }, [delayTime, show]);

  return useMemo(() => {
    return show || localShow;
  }, [show, localShow]);
}
