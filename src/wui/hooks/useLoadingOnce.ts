import { useMemo, useRef } from 'react';

export function useLoadingOnce(loading: boolean) {
  const initRef = useRef(false);

  return useMemo(() => {
    if (!loading) {
      return false;
    }
    if (!initRef.current) {
      initRef.current = true;
      return loading;
    }
    return false;
  }, [loading]);
}
