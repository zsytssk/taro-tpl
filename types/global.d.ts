/// <reference types="@tarojs/taro" />
/// <reference types="@mini-types/alipay" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let GLOBAL_VARS: any;
declare let LOCATION_APIKEY: string;

type ExtractPromise<Type> = Type extends Promise<infer X> ? X : never;
