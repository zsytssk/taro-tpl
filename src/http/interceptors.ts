import { isAlipay, isWeapp } from '@/wui/utils';

import apiUrl from './apiUrl';

//网络请求拦截器
export const interceptor = function (chain) {
  const requestParams = chain.requestParams;
  // 将token添加到头部
  requestParams.header = {
    ...requestParams.header,
    token,
  };
  // 微信/支付宝
  const platform = isWeapp() ? 1 : isAlipay() ? 2 : 0;
  requestParams.data = {
    ...requestParams.data,
    platform,
  };
  // 处理url前缀
  requestParams.url = apiUrl(requestParams.url);
  return chain.proceed(requestParams).then((res) => {
    console.log(
      `http <---- ${requestParams.url}   \ndata: `,
      requestParams.data,
      '\nresult: ',
      res,
    );
    return res;
  });
};

export async function errorInterceptor(err): Promise<void> {
  //
}
