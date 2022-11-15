import { View } from '@tarojs/components';
import classNames from 'classnames';
import { memo, useEffect, useMemo, useRef } from 'react';

import { Props, useModalListStore } from '.';
import { getCurPageId } from '../../taroUtils/utils';
import { floor, genRandomStr } from '../../utils';
import { useDelayShow } from './useDelayShow';

import './style.less';

/** 隐藏时不销毁dom， 通过class=hide｜show来控制显示隐藏 */
export const ModalStay = memo(
  ({
    className,
    visible,
    children,
    onClose,
    clickMaskHide = true,
    transTime = 300,
    transClass = 'scale-in',
  }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onCloseRef = useRef<typeof onClose>();
    const isShow = useDelayShow(visible, transTime);
    const oldNodeRef = useRef<JSX.Element>();

    const idRef = useMemo(() => {
      return genRandomStr();
    }, []);

    useEffect(() => {
      onCloseRef.current = onClose;
    }, [onClose]);

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

    useEffect(() => {
      const { addModal, replaceModal } = useModalListStore.getState();
      if (!oldNodeRef.current) {
        addModal(Node, curPageId);
      } else {
        replaceModal(oldNodeRef.current, Node, curPageId);
      }
      return () => {
        oldNodeRef.current = Node;
      };
    }, [Node, curPageId]);

    // 销毁的单独处理
    useEffect(() => {
      const { removeModal } = useModalListStore.getState();
      return () => {
        if (oldNodeRef.current) {
          removeModal(oldNodeRef.current, curPageId);
        }
      };
    }, [curPageId]);

    return null;
  },
);
