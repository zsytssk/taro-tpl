/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, ButtonProps, View } from '@tarojs/components';
import Taro, { openLocation as TaroOpenLocation } from '@tarojs/taro';

import { compareVersion } from './utils';

/** 支付 */
export async function requestPayment(
  options: Taro.requestPayment.Option,
): Promise<TaroGeneral.CallbackResult> {
  return Taro.requestPayment(options);
}

type Params = Parameters<typeof TaroOpenLocation>[0];
export async function openLocation({
  latitude,
  longitude,
  name,
  address,
}: Params) {
  return Taro.openLocation({
    latitude: Number(latitude),
    longitude: Number(longitude),
    scale: 18,
    name: name,
    address: address,
  });
}

export function BtnGetPhoneNumber({ ...props }: ButtonProps) {
  return <Button open-type={'getPhoneNumber'} {...props} />;
}

export function BtnGetAuthorize({ onGetAuthorize, ...props }: ButtonProps) {
  const version = Taro.getSystemInfoSync().SDKVersion;
  if (!onGetAuthorize) {
    return <View {...props} />;
  }

  if (compareVersion(version || '', '2.21.2') >= 0) {
    return (
      <Button
        open-type="chooseAvatar"
        onChooseAvatar={onGetAuthorize}
        {...props}
      />
    );
  }
  return <Button scope="userInfo" onClick={onGetAuthorize} {...props} />;
}
