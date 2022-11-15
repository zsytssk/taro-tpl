import Taro from '@tarojs/taro';
import dayjs from 'dayjs';

export type StorageData = {
  expire_time: number;
  data: unknown;
};

export const getLocalStorage = (key: string, withExpire = false) => {
  const data = Taro.getStorageSync(key) as StorageData;
  if (!data) {
    return;
  }
  const { expire_time } = data;
  const current = new Date().getTime();
  if (expire_time && current > expire_time) {
    // 有效期过了则清除
    removeLocalStorage(key);
    return;
  }
  if (withExpire) {
    return data;
  }
  return data.data;
};

/** 过期时间模式：自然日 ｜ 时间间隔 */
export type ExpireType = 'NaturalDay' | 'TimeSpace';
export const setLocalStorage = (
  key: string,
  obj: unknown,
  /** 过期天数 */
  expire?: number,
  /** 过期天模式 */
  expire_type?: ExpireType,
) => {
  let expire_time = 0;
  if (expire) {
    const now = new Date().getTime();
    if (expire_type === 'NaturalDay') {
      expire_time = dayjs()
        .endOf('day')
        .add(expire - 1, 'day')
        .valueOf();
    } else {
      expire_time = now + expire * 24 * 3600 * 1000;
    }
  }

  const res: StorageData = {
    data: obj,
    expire_time,
  };
  Taro.setStorageSync(key, res);
};

export const removeLocalStorage = (key: string) => {
  Taro.removeStorageSync(key);
};
