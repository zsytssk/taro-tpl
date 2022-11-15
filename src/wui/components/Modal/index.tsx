import { View } from '@tarojs/components';
import { memo, useMemo } from 'react';
import { getCurPageId } from 'src/wui/taroUtils/utils';
import create from 'zustand';


export { Modal, type Props } from './Modal';
export { ModalStay } from './ModalStay';

// type ModalItem = () => JSX.Element;
type ModalItem = JSX.Element;
type State = {
  modalMap: {
    [key: string]: ModalItem[];
  };
  addModal: (node: ModalItem, pageId: string) => void;
  removeModal: (node: ModalItem, pageId: string) => void;
  replaceModal: (
    oldNode: ModalItem,
    newNode: ModalItem,
    pageId: string,
  ) => void;
  clearModal: (pageId: string) => void;
};

export const useModalListStore = create<State>((set, get) => ({
  modalMap: {},
  addModal: (node, curPage) => {
    const { modalMap } = get();
    // console.warn(`test:>ModalManager:>addModal`);
    let modalList = modalMap[curPage];
    if (!modalList) {
      modalList = [];
    }
    modalList.push(node);
    set({
      modalMap: {
        ...modalMap,
        [curPage]: [...modalList],
      },
    });
  },
  removeModal: (node, curPage) => {
    const { modalMap } = get();
    const modalList = modalMap[curPage];
    // console.warn(`test:>ModalManager:>removeModal`);
    if (!modalList?.length) {
      return;
    }
    const index = modalList.indexOf(node);
    if (index === -1) {
      return;
    }
    modalList.splice(index, 1);
    set({ modalMap: { ...modalMap, [curPage]: modalList } });
  },
  replaceModal: (oldNode, newNode, curPage) => {
    const { modalMap } = get();
    const modalList = modalMap[curPage];
    if (!modalList?.length) {
      return;
    }
    const index = modalList.indexOf(oldNode);
    if (index === -1) {
      return;
    }
    modalList.splice(index, 1, newNode);
    set({ modalMap: { ...modalMap, [curPage]: [...modalList] } });
  },
  clearModal: (page: string) => {
    const { modalMap } = get();
    delete modalMap[page];
    // console.log(`test:>ModalManager:>3`);
    set({ modalMap: { ...modalMap } });
  },
}));

export const ModalManager = memo(() => {
  const { modalMap } = useModalListStore();

  const curPageId = useMemo(() => {
    return getCurPageId();
  }, []);

  const modalList = useMemo(() => {
    if (!curPageId) {
      return [];
    }
    return modalMap[curPageId] || [];
  }, [modalMap, curPageId]);

  // console.warn(
  //   `test:>ModalManager:>render`,
  //   modalList?.map((item) => item.key),
  // );
  return (
    <View>
      {modalList.map((Item) => {
        return Item;
      })}
    </View>
  );
});
