import Guild from "./analyticsFragments/guilds";
import Images from "./analyticsFragments/images";
import Me from "./analyticsFragments/me";
import TabContainer from "./components/tabContainer";
import TabContent from "./components/tabContent";

import { RouteBases } from "discord-api-types/rest/v9";
import React, { useCallback } from "react";
import { SWRConfig } from "swr";


type Props = {
  tokenType: string,
  accessToken: string,
};

export default function Analytics(props: Props){
  const fetcher = useCallback(async (url: string) => {
    const res = await window.fetch(`${RouteBases.api}${url}`, {
      headers: {
        authorization: `${props.tokenType} ${props.accessToken}`,
      },
    });
    if(!res.ok){
      throw new Error(`An HTTP error occurred: ${res.status}`);
    }
    return res.json();
  }, [props]);

  return (
    <SWRConfig value={{
      fetcher,
      dedupingInterval: 10 * 60 * 1000,
    }}>
      <h2>分析結果</h2>
      <TabContainer id="main" defaultKey="me">
        <TabContent name="ユーザー" tabKey="me">
          <Me />
        </TabContent>
        <TabContent name="画像URL作成" tabKey="image">
          <Images />
        </TabContent>
        <TabContent name="サーバー" tabKey="guild">
          <Guild />
        </TabContent>
      </TabContainer>
    </SWRConfig>
  );
}
