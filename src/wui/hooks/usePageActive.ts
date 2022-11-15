import { useDidHide, useDidShow } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import { getCurPageId } from "../taroUtils/utils";

/**
 * 检查当前page是不是active状态：
 * 非active：切到其他页面,
 * bug: 如过组件是通过条件判断显示的，而且它是在useDidHide后显示的，那么开始的时候active就是错的
 * - const router = useRouter()
 */
export function usePageActive() {
  const [active, setActive] = useState<boolean>(true);
  const curPageRef = useRef();

  useEffect(() => {
    curPageRef.current = getCurPageId();
    return () => {
      curPageRef.current = undefined;
    };
  }, []);

  useDidShow(() => {
    setActive(true);
  });

  useDidHide(() => {
    detectPageChange(curPageRef.current).then(() => {
      setActive(false);
    });
  });

  return active;
}

export function detectPageChange(oldPage?: string) {
  return new Promise(resolve => {
    // 这个主要是为了兼容支付宝
    const interval = setInterval(() => {
      if (getCurPageId() !== oldPage) {
        resolve(true);
        clearInterval(interval);
      }
    }, 50);

    // 这个主要是为了兼容微信
    Promise.resolve().then(() => {
      if (getCurPageId() !== oldPage) {
        resolve(true);
        clearInterval(interval);
        return;
      }
    });
  });
}
