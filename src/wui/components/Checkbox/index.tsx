import {
  CheckboxProps,
  Label,
  Checkbox as TaroCheckbox,
  Text,
} from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';

import './index.less';

type Props = {
  onChange: (checked: boolean) => void;
  children: ReactNode;
} & CheckboxProps;

export function Checkbox({
  className,
  children,
  onChange,
  ...otherProps
}: Props) {
  return (
    <Label
      className="wui-checkbox-wrap"
      onClick={() => {
        onChange(!otherProps.checked);
      }}
    >
      <TaroCheckbox
        className={classNames('wui-checkbox', className)}
        {...otherProps}
      />
      <Text>{children}</Text>
    </Label>
  );
}
