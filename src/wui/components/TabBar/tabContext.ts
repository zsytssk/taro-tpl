import { createContext } from 'react';

import { FunKey } from '.';

export type TabContextProps = {
  activeKey: string;
  removeKey: FunKey;
  addKey: FunKey;
  setActiveKey: FunKey;
  setAnimateBarStyle: (style: React.CSSProperties) => void;
};
export const TabContext = createContext({} as TabContextProps);
