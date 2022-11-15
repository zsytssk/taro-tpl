import { View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { TabContext } from './tabContext';

import styles from './index.module.less';

export { TabItem } from './tabItem';

export type FunKey = (key: string) => void;
export type TabProps = {
  activeItem: string;
  onChange: FunKey;
  children: ReactNode[];
  className?: string;
};
export function TabBar({
  className,
  children,
  onChange,
  activeItem,
}: TabProps) {
  const [activeLocalKey, setActiveLocalKey] = useState(activeItem);
  const [keyList, setKeyList] = useState<string[]>([]);
  const [animateBarStyle, setAnimateBarStyle] = useState(
    {} as React.CSSProperties,
  );
  const activeLocalKeyRef = useRef<string>(activeLocalKey);
  const onChangeRef = useRef<FunKey>();

  useEffect(() => {
    if (activeItem && activeItem !== activeLocalKeyRef.current) {
      setActiveLocalKey(activeItem);
    }
  }, [activeItem]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    activeLocalKeyRef.current = activeLocalKey;
    onChangeRef.current?.(activeLocalKey);
  }, [activeLocalKey]);

  useEffect(() => {
    const curKey = activeLocalKeyRef.current;
    if (keyList.indexOf(curKey) !== -1) {
      return;
    }
    if (keyList[0]) {
      setActiveLocalKey(keyList[0]);
    }
  }, [keyList]);

  const addKey = useCallback((key: string) => {
    setKeyList((old) => [...old, key]);
  }, []);

  const removeKey = useCallback((key: string) => {
    setKeyList((old) => {
      return old.filter((item) => item !== key);
    });
  }, []);

  const setActiveKey = useCallback((key: string) => {
    setActiveLocalKey(key);
  }, []);

  return (
    <View className={classNames(styles.tabBar, className)}>
      <TabContext.Provider
        value={{
          addKey,
          removeKey,
          activeKey: activeLocalKey,
          setActiveKey,
          setAnimateBarStyle,
        }}
      >
        <View className="tab-list">
          {children}
          {animateBarStyle.left !== undefined ? (
            <View className="tab-animate-bar" style={animateBarStyle} />
          ) : null}
        </View>
      </TabContext.Provider>
    </View>
  );
}
