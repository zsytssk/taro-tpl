export function sleep(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, time * 1000);
  });
}

export function genRandomStr() {
  return Math.random()
    .toString(36)
    .replace('0.', '');
}
export function floor(num: number, decimal?: number) {
  if (!decimal) {
    return Math.floor(num);
  }
  const tenTimes = Math.pow(10, decimal);
  return Math.floor(num * tenTimes) / tenTimes;
}

export function isNil(v) {
  return typeof v === 'undefined' || v === null;
}

export function isWeapp() {
  return process.env.TARO_ENV === 'weapp';
}

export function isAlipay() {
  return process.env.TARO_ENV === 'alipay';
}
