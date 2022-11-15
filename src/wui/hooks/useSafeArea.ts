import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';

export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    const info = Taro.getSystemInfoSync();
    if (
      info.safeArea?.bottom !== undefined ||
      info.safeArea?.top !== undefined
    ) {
      const safeInfo = {
        top: info.safeArea?.top,
        bottom: info.screenHeight - info.safeArea?.bottom,
      };
      // 支付宝开发者工具中bottom=34，手机中是好的；。。。
      if (safeInfo.bottom > 100) {
        safeInfo.bottom = info.safeArea?.bottom;
      }
      setSafeArea(safeInfo);
    }
  }, []);

  return safeArea;
}
