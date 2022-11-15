import Taro, { scanCode as TarpScanCode } from '@tarojs/taro';

import AppConfig from '../../app.config';

export function getCurPageId() {
  const pages = Taro.getCurrentPages();
  const curPageInfo = pages[pages.length - 1];
  if (!curPageInfo) {
    return;
  }
  return curPageInfo.$taroPath;
}
export function getCurPagePath() {
  const pages = Taro.getCurrentPages();
  const curPageInfo = pages[pages.length - 1];
  return curPageInfo?.route;
}

type Option = {
  /** 跳转的url带的参数 */
  params?: string;
  /** 是否替换当前页面 */
  replace?: boolean;
};
/** 页面跳转 */
export function goto(
  page: string,
  option: Option = { params: '', replace: false },
) {
  const pages = AppConfig.pages;
  const tabList = AppConfig.tabBar?.list;

  const targetPath = `pages/${page}/index`;
  if (pages?.indexOf(targetPath) === -1) {
    throw new Error(`cant find page:${page} in app.config.ts`);
  }
  const params = option.params || '';
  const replace = option.replace || '';

  return new Promise((resolve, _reject) => {
    const options = {
      url: `/pages/${page}/index?${params}`,
      success(res) {
        resolve(true);
      },
      fail() {
        resolve(false);
      },
    };
    // 在tab中
    const findInTab = tabList?.find((item) => item.pagePath === targetPath);
    if (findInTab) {
      return Taro.switchTab(options);
    }
    if (!replace) {
      return Taro.navigateTo(options);
    } else {
      return Taro.redirectTo(options);
    }
  });
}

export function showToast(msg: string, time = 2000) {
  return new Promise<void>((resolve) => {
    Taro.showToast({ icon: 'none', title: msg, duration: time });
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function refresh() {
  const pages = Taro.getCurrentPages();
  const page = pages[pages.length - 1];
  page.onLoad();
}

type SuccessCallbackResult = ExtractPromise<ReturnType<typeof TarpScanCode>>;
export function scanCode() {
  return new Promise<SuccessCallbackResult>((resolve, reject) => {
    Taro.scanCode({
      success: (result) => {
        resolve(result);
      },
      fail: (result) => {
        reject(result);
      },
    });
  });
}
