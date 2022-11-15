import {
  CheckboxProps,
  Label,
  Checkbox as TaroCheckbox,
  Text,
  View,
} from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';

import './index.less';

type Props = {
  onChange: (checked: boolean) => void;
  children: ReactNode;
} & CheckboxProps;

export function Checkbox({
  children,
  className,
  onChange,
  ...otherProps
}: Props) {
  return (
    <View
      onClick={() => {
        onChange(!otherProps.checked);
      }}
    >
      <Label className="wui-checkbox-wrap">
        <TaroCheckbox
          className={classNames('wui-checkbox', className)}
          {...otherProps}
        />
        <Text>{children}</Text>
      </Label>
    </View>
  );
}
