import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export function useCssTransition(
  isIn: boolean,
  transClass: string,
  nodeRef: React.RefObject<HTMLDivElement>,
  name = '',
  transTime = 300,
) {
  const hasEnterRef = useRef(false);
  const [localVisible, setLocalVisible] = useState(isIn);

  useEffect(() => {
    if (isIn) {
      setLocalVisible(true);
    }
  }, [isIn]);

  const addClass = useCallback(
    (status) => {
      const arr = [
        `${transClass}-enter`,
        `${transClass}-enter-active`,
        `${transClass}-enter-done`,
        `${transClass}-exit`,
        `${transClass}-exit-active`,
        `${transClass}-exit-done`,
      ];
      for (const item of arr) {
        nodeRef.current?.classList.remove(item);
      }
      nodeRef.current?.classList.add(`${transClass}-${status}`);
      // console.log(
      //   `test:>useModalTransition:>${name}:>2`,
      //   status,
      //   nodeRef.current?.classList,
      // );
    },
    [transClass, nodeRef],
  );

  useEffect(() => {
    if (!hasEnterRef.current && !isIn) {
      return;
    }

    hasEnterRef.current = isIn;
    const timeout1 = setTimeout(() => {
      addClass(isIn ? 'enter' : 'exit');
    });

    const timeout2 = setTimeout(() => {
      addClass(isIn ? 'enter-active' : 'exit-active');
    }, 16);

    const timeout3 = setTimeout(() => {
      addClass(isIn ? 'enter-done' : 'exit-done');
      if (!isIn) {
        setLocalVisible(false);
      }
    }, transTime);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [transTime, isIn, addClass]);

  // console.warn(
  //   `test:>useModalTransition:>${name}:>1`,
  //   isIn,
  //   hasEnterRef.current,
  //   nodeRef,
  // );

  return useMemo(() => {
    if (isIn || localVisible) {
      return true;
    }
    return false;
  }, [isIn, localVisible]);
}
