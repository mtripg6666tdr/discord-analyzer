import type { TabContextType } from "./tabContext";
import type React from "react";

import { TabContextHolder } from "./tabContext";

import { useContext, useLayoutEffect } from "react";


type Props = {
  children: React.ReactNode,
  tabKey: string,
  name: string,
};

export default function TabContent(props: Props){
  const tabContextHolder = useContext(TabContextHolder);
  let context: TabContextType = null!;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  Array.from(tabContextHolder.values()).find(ctxp => context = context || useContext<TabContextType>(ctxp));

  useLayoutEffect(() => {
    context.addTabContent(props.name, props.tabKey);
  }, [context, props.name, props.tabKey]);

  if(context.activeTabKey === props.tabKey){
    return props.children;
  }else{
    return null;
  }
}
