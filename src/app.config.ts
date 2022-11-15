// eslint-disable-next-line @typescript-eslint/no-explicit-any
let localDefineAppConfig: typeof defineAppConfig = (global as any)
  .defineAppConfig;
if (!localDefineAppConfig) {
  localDefineAppConfig = (res) => res;
}

export default localDefineAppConfig({
  pages: ['pages/index/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
