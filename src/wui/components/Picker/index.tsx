import {
  BaseEventOrig,
  Button,
  Image,
  PickerView,
  PickerViewColumn,
  PickerViewProps,
  View,
} from '@tarojs/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Modal, Props as ModalProps } from '@/wui/Modal';

import { getIndexFromValue, getValueFromIndex } from './utils';

import styles from './index.module.less';
import IconClose from '@/assets/icons/icon-close2.svg';

export type Item<T> = {
  label: string;
  value: T;
};
type Props<T> = {
  title: string;
  value?: T;
  data?: Item<T>[];
  onChange?: (value: T) => void;
  multiValue?: T[];
  multiData?: Item<T>[][];
  onMultiChange?: (value: T[]) => void;
  onMultiUpdate?: (value: T, index: number) => void;
  confirmText?: string;
} & ModalProps;

type ChangeProps = BaseEventOrig<PickerViewProps.onChangeEventDetail>;
/** 选择取餐时间 */
export function Picker<T>({
  title,
  value,
  data,
  visible,
  multiValue,
  multiData,
  onChange,
  onMultiChange,
  onMultiUpdate,
  confirmText,
  onClose,
}: Props<T>) {
  const [localValue, setLocalValue] = useState<T[]>();
  const [localData, setLocalData] = useState<Item<T>[][]>();
  const closeRef = useRef<() => void>();
  const changeRef = useRef<(value: T[]) => void>();
  const updateRef = useRef<(value: T, index: number) => void>();
  const isMulti = useMemo(() => {
    if (multiData) {
      return true;
    }
    return false;
  }, [multiData]);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!onMultiUpdate) {
      return;
    }
    updateRef.current = (value, index) => {
      if (!isMulti) {
        return;
      }
      onMultiUpdate?.(value, index);
    };
    return () => {
      updateRef.current = undefined;
    };
  }, [onMultiUpdate, isMulti]);

  useEffect(() => {
    changeRef.current = (value: T[]) => {
      if (!isMulti) {
        onChange?.(value[0]);
      } else {
        onMultiChange?.(value);
      }
    };
  }, [isMulti, onChange, onMultiChange]);

  const localClose = useCallback(() => {
    closeRef.current?.();
  }, []);

  const setLocalValueFn = useCallback((value: T[]) => {
    setLocalValue((old) => {
      for (let i = 0; i < value?.length; i++) {
        const oldItem = old?.[i];
        const newItem = value[i];
        if (oldItem !== newItem) {
          updateRef.current?.(newItem, i);
        }
      }

      return value;
    });
  }, []);

  useEffect(() => {
    if (!isMulti) {
      if (value) {
        setLocalValueFn([value]);
      }
      return;
    }
    if (multiValue) {
      setLocalValueFn(multiValue);
    }
  }, [isMulti, value, multiValue, setLocalValueFn]);

  useEffect(() => {
    if (!data?.length && !multiData?.length) {
      return;
    }
    if (data) {
      setLocalData([data]);
    } else if (multiData) {
      setLocalData(multiData);
    }
  }, [data, multiData]);

  const pickerValue = useMemo(() => {
    if (!localValue || !localData) {
      return [];
    }
    const tempLocalValue = localValue;
    const result = getIndexFromValue(localValue, localData);
    let needChangeLocalValue = false;
    for (let i = 0; i < result.length; i++) {
      if (result[i] === -1) {
        result[i] = 0;
        tempLocalValue[i] = localData[i][0].value;
        needChangeLocalValue = true;
      }
    }
    if (needChangeLocalValue) {
      setLocalValueFn(tempLocalValue);
    }
    return result;
  }, [localValue, localData, setLocalValueFn]);

  const onLocalChange = useCallback(
    (e: ChangeProps) => {
      console.log(`test:>picker:>onLocalChange`);
      const indexArr = e.detail.value;
      if (!localData) {
        return;
      }
      const value = getValueFromIndex(indexArr, localData);
      // console.log(`test:>onMultiUpdate:>0`, indexArr, value);
      setLocalValueFn(value);
    },
    [localData, setLocalValueFn],
  );

  const onConfirm = useCallback(() => {
    if (localValue) {
      changeRef.current?.(localValue);
    }
    localClose();
  }, [localClose, localValue]);

  return (
    <Modal
      className={styles.picker}
      onClose={localClose}
      visible={visible}
      name="picker"
      transClass="slide-bottom-in"
    >
      <View className="modalInner">
        <Button className="btn-close" onClick={() => localClose()}>
          <Image src={IconClose} />
        </Button>
        <View className="title">{title}</View>
        <View className="content">
          <PickerView
            className="pickerView"
            indicatorStyle="height: 50px;"
            value={pickerValue}
            key={pickerValue.join('')}
            immediateChange={true}
            onChange={onLocalChange}
          >
            {localData?.map((itemData, index) => {
              let key = index;
              if (index > 0) {
                key = pickerValue[index - 1];
              }
              return (
                <PickerViewColumn key={key + ''}>
                  {itemData.map((item) => {
                    return (
                      <View key={item.label} className="item">
                        {item.label}
                      </View>
                    );
                  })}
                </PickerViewColumn>
              );
            })}
          </PickerView>
        </View>
        <View className="footer">
          <Button onClick={onConfirm}>{confirmText || '确定'}</Button>
        </View>
      </View>
    </Modal>
  );
}
