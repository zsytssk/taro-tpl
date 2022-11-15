import { View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';

import { ModalLoading } from '../ModalLoading';
import { useMinTimeShow } from './useMinTimeShow';

import './spin.less';

type Props = {
  spin: boolean;
  children?: ReactNode;
  delay?: number;
  transTime?: number;
  /** 默认进入动画
   * - 默认为 fade-in
   */
  animate?: boolean;
  className?: string;
  showLoading?: boolean;
};

export function Spin({
  children,
  spin,
  animate = true,
  className = '',
  delay = 500,
  transTime = 100,
  showLoading = true,
}: Props) {
  const isSpin = useMinTimeShow(spin, delay);

  return (
    <View
      className={classNames({
        'wui-spin': true,
        'fade-in': animate,
        'fade-in-enter': animate && !isSpin,
        [className]: true,
      })}
      style={{ transitionDuration: `${transTime}ms` }}
    >
      {showLoading ? (
        <ModalLoading visible={isSpin} transTime={transTime} />
      ) : null}
      {children}
    </View>
  );
}
