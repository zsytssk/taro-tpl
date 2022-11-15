/* eslint-disable @typescript-eslint/no-explicit-any */
import Taro from '@tarojs/taro';

// request的请求参数类型，其中 T 为 data的类型
type Option<T> = Taro.request.Option<T>;
type PartOption<T> = Omit<Option<T>, 'url'>;

export function addInterceptor(interceptor) {
  Taro.addInterceptor(interceptor);
}

export default async function fetch(
  options: Option<any>,
  retry = 3,
): Promise<any> {
  options = {
    header: {
      'content-type': 'application/json',
      ...options.header,
    },
    method: 'GET',
    ...options,
  };

  const request = () =>
    new Promise((resolve, reject) => {
      Taro.request(options).then(
        (response) => {
          if (response.errMsg) {
            return reject(response.errMsg);
          }
          resolve(response.data);
        },
        (err) => {
          // 可能报错：后端服务器没有在小程序后台配置合法域名，直接抛出错误,这个时候请求还没发出去，所以是小程序报错，后面promise可以捕获，同时错误也会被抛出（这是小程序本身控制的）
          return reject(
            new Error(
              err.message || err.errMsg || err.errorMessage, // 微信是errMsg，支付宝是：errorMessage
            ),
          );
        },
      );
    });

  let error;
  for (let i = 0; i < retry; i++) {
    try {
      const res = await request();
      return res;
    } catch (err) {
      error = err;
    }
  }
  throw error;
}

export function get(url, options: PartOption<any> = {}) {
  return fetch({ ...options, url, method: 'GET' });
}

export function post(url, options: PartOption<any> = {}) {
  return fetch({ ...options, url, method: 'POST' });
}
