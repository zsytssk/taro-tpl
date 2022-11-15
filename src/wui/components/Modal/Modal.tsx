import { View } from '@tarojs/components';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useRef } from 'react';

import { useModalListStore } from '.';
import { getCurPageId } from '../../taroUtils/utils';
import { floor, genRandomStr } from '../../utils';
import { useDelayShow } from './useDelayShow';

import './style.less';

export type Props = {
  visible: boolean;
  onClose?: () => void;
  onClosed?: () => void;
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  /** class设置弹出动画，内置支持下面这些，自定义的需要自己写动画
   * - scale-in(默认) 放大进入
   * - fade-in(默认) 控制透明度进入
   * - slide-right-in 从右弹出
   * - slide-bottom-in 底部向上弹出
   **/
  transClass?: string;
  /** 动画时间-毫秒 */
  transTime?: number;
  clickMaskHide?: boolean;
  /** 是否自己渲染 */
  renderNode?: boolean;
  name?: string;
};

export const Modal = memo(
  ({
    className,
    visible,
    children,
    onClose,
    onClosed,
    clickMaskHide = true,
    transTime = 300,
    renderNode = true,
    // transClass = 'slide-bottom-in',
    transClass = 'scale-in',
  }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef<typeof onClose>();
    const onClosedRef = useRef<typeof onClose>();
    const isShow = useDelayShow(visible, transTime);
    const oldNodeRef = useRef<JSX.Element>();

    const idRef = useMemo(() => {
      return genRandomStr();
    }, []);

    useEffect(() => {
      onCloseRef.current = onClose;
      return () => (onCloseRef.current = undefined);
    }, [onClose]);

    useEffect(() => {
      onClosedRef.current = onClosed;
      return () => (onClosedRef.current = undefined);
    }, [onClosed]);

    const Node = useMemo(() => {
      return (
        <View
          key={idRef}
          className={classNames({
            [className as string]: Boolean(className),
            'wui-modal-root': true,
            hide: !isShow,
          })}
        >
          <View
            style={{ animationDuration: floor(transTime / 1000, 2) + 's' }}
            className={classNames({
              ['wui-modal-mask']: true,
              hide: !visible,
            })}
            onClick={() => {
              clickMaskHide && onCloseRef.current?.();
            }}
          ></View>
          <View
            ref={containerRef}
            style={{ animationDuration: floor(transTime / 1000, 2) + 's' }}
            className={classNames({
              ['wui-modal-wrap']: true,
              [transClass]: true,
              hide: !visible,
            })}
          >
            {children}
          </View>
        </View>
      );
    }, [
      idRef,
      className,
      transClass,
      transTime,
      children,
      clickMaskHide,
      isShow,
      visible,
    ]);

    const curPageId = useMemo(() => {
      return getCurPageId();
    }, []);

    // 处理show hide
    useEffect(() => {
      const { addModal, replaceModal, removeModal } =
        useModalListStore.getState();
      if (!Node || !curPageId || !renderNode) {
        return;
      }
      if (isShow) {
        if (!oldNodeRef.current) {
          addModal(Node, curPageId);
        } else {
          replaceModal(oldNodeRef.current, Node, curPageId);
        }
        oldNodeRef.current = Node;
      } else {
        if (oldNodeRef.current) {
          removeModal(oldNodeRef.current, curPageId);
        }
        onClosedRef.current?.();
        oldNodeRef.current = undefined;
      }
    }, [isShow, Node, curPageId, renderNode]);

    // 销毁的单独处理
    useEffect(() => {
      const { removeModal } = useModalListStore.getState();
      return () => {
        if (oldNodeRef.current) {
          removeModal(oldNodeRef.current, curPageId);
        }
      };
    }, [curPageId]);

    // 不通过addModal渲染节点的onClosed逻辑
    useEffect(() => {
      if (renderNode) {
        return;
      }
      if (!isShow) {
        onClosedRef.current?.();
      }
    }, [isShow, renderNode]);

    if (renderNode) {
      return null;
    }
    return Node;
  },
);
