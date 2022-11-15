import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classNames from 'classnames';
import { useContext, useEffect, useMemo, useRef } from 'react';

import { TabContext } from './tabContext';

export type TabItemProps = {
  value: string;
  label: string;
};
export function TabItem({ value, label }: TabItemProps) {
  const { activeKey, setActiveKey, addKey, removeKey, setAnimateBarStyle } =
    useContext(TabContext);
  const tabRef = useRef();

  useEffect(() => {
    addKey(value);
    return () => removeKey(value);
  }, [addKey, removeKey, value]);

  const isActive = useMemo(() => {
    return activeKey === value;
  }, [activeKey, value]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    const timeout = setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query
        .select(`#tab-item-${value} .text`)
        .boundingClientRect()
        .exec((recArr) => {
          // console.log(`test:>tab-item:>1`, recArr[0]);
          const rec = recArr?.[0];
          if (!rec) {
            return;
          }
          setAnimateBarStyle({ width: rec.width, left: rec.left });
        });
    });
    return () => clearTimeout(timeout);
  }, [isActive, value, setAnimateBarStyle]);

  return (
    <View
      ref={tabRef}
      id={`tab-item-${value}`}
      className={classNames({
        ['tab-item']: true,
        ['tab-item-active']: isActive,
      })}
      onClick={() => setActiveKey(value)}
    >
      <Text className="text">{label}</Text>
    </View>
  );
}
