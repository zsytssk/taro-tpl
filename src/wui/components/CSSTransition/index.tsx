import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

type FunVoid = () => void;

type Props = {
  visible: boolean;
  transClass: string;
  transTime?: number;
  containerRef: React.RefObject<HTMLDivElement>;
  children: ReactNode;
  onEnter?: FunVoid;
  onEntered?: FunVoid;
  onExit?: FunVoid;
  onExited?: FunVoid;
  name?: string;
};

export function CSSTransition({
  children,
  visible,
  transTime = 300,
  containerRef,
  transClass,
  name = '',
}: Props) {
  const [localVisible, setLocalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setLocalVisible(true);
    }
  }, [visible]);

  const isIn = useMemo(() => {
    if (visible && localVisible) {
      return true;
    }
    return false;
  }, [visible, localVisible]);

  const isShow = useMemo(() => {
    if (visible || localVisible) {
      return true;
    }
    return false;
  }, [visible, localVisible]);

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
        containerRef.current?.classList.remove(item);
      }
      containerRef.current?.classList.add(`${transClass}-${status}`);
      console.log(
        // `test:>useModalTransition:>${name}:>2`,
        status,
        containerRef.current?.classList,
      );
    },
    [transClass, containerRef],
  );

  useMemo(() => {
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

  if (!isShow) {
    return null;
  }

  return <>{children}</>;
}
