import type { TabContextType, TabMeta } from "./tabContext";

import { TabContextHolder } from "./tabContext";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type Props = {
  children: React.ReactNode,
  defaultKey: string,
  id: string,
};

export default function TabContainer(props: Props){
  const tabContextHolder = useContext(TabContextHolder);
  const TabContext = tabContextHolder.get(props.id) || (() => {
    const context = createContext<TabContextType>({} as any);
    tabContextHolder.set(props.id, context);
    return context;
  })();
  const [activeKey, setActiveKey] = useState<string>(props.defaultKey);
  const [tabs, setTabs] = useState<TabMeta[]>([]);
  const addTabContent = useCallback((name: string, key: string) => {
    setTabs(currentTabs => {
      const existing = currentTabs.find(tab => tab.key === key);
      if(existing){
        if(existing.name === name){
          return currentTabs;
        }else{
          existing.name = name;
          return [...currentTabs];
        }
      }else{
        return [...currentTabs, { name, key }];
      }
    });
  }, []);
  const state = useMemo<TabContextType>(() => ({
    activeTabKey: activeKey,
    addTabContent,
  }), [activeKey, addTabContent]);

  return (
    <div className="tab_container">
      <TabContext.Provider value={state}>
        <ul className="nav">
          {
            tabs.map(({ name, key }) => (
              <li key={key} className={activeKey === key ? "active" : ""} onClick={() => setActiveKey(key)}>{name}</li>
            ))
          }
        </ul>
        {props.children}
      </TabContext.Provider>
    </div>
  );
}
