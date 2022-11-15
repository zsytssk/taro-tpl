import { Text, View } from '@tarojs/components';

import { Modal } from '../Modal/Modal';

import styles from './index.module.less';

// import logo from './logo.png';

type Props = {
  visible: boolean;
  transTime?: number;
};
export function ModalLoading({ visible, transTime = 100 }: Props) {
  return (
    <Modal
      className={styles.modalLoading}
      visible={visible}
      name={'ModalLoading'}
      transClass="fade-in"
      transTime={transTime}
    >
      <View className="lds-circle">
        {/* <Image className="item" src={logo} /> */}
      </View>
      <Text>正在加载...</Text>
    </Modal>
  );
}
