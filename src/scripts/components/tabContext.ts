import type { Context } from "react";

import { createContext } from "react";

export type TabContextType = {
  activeTabKey: string,
  addTabContent: (name: string, key: string) => void,
};

export type TabMeta = {
  name: string,
  key: string,
};

export const TabContextHolder = createContext<Map<string, Context<TabContextType>>>(new Map());
