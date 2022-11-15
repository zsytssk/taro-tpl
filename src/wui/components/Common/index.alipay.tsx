import { Button, ButtonProps } from '@tarojs/components';
import { openLocation as TaroOpenLocation } from '@tarojs/taro';

/** 支付 */
export async function requestPayment(
  options: Parameters<typeof my.tradePay>[0],
): Promise<ReturnType<typeof my.tradePay>> {
  return my.tradePay(options);
}

type Params = Parameters<typeof TaroOpenLocation>[0];
export async function openLocation({
  latitude,
  longitude,
  name,
  address,
  scale,
}: Params) {
  return my.openLocation({
    latitude: latitude + '',
    longitude: longitude + '',
    name: name || '',
    scale: scale,
    address: address || name || '',
  });
}

export function BtnGetPhoneNumber({ onGetPhoneNumber, ...props }: ButtonProps) {
  return (
    <Button
      open-type={'getAuthorize'}
      scope="phoneNumber"
      onGetAuthorize={onGetPhoneNumber}
      onError={onGetPhoneNumber}
      {...props}
    />
  );
}

export function BtnGetAuthorize({ onGetAuthorize, ...props }: ButtonProps) {
  return (
    <Button
      open-type={'getAuthorize'}
      scope="userInfo"
      onGetAuthorize={onGetAuthorize}
      {...props}
    />
  );
}
