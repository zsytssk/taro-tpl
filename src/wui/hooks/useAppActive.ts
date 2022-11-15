import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

export function useAppActive() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const onAppHide = () => {
      setActive(false);
    };
    const onAppShow = () => {
      setActive(true);
    };
    Taro.onAppHide(onAppHide);
    Taro.onAppShow(onAppShow);

    return () => {
      Taro.offAppHide(onAppHide);
      Taro.offAppShow(onAppShow);
    };
  }, []);

  return active;
}
