import type { RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v9";

import DetailedGuildInfoContainer from "./detailedContainer";
import SWRSuspense from "../../components/swrSuspense";

import { Routes } from "discord-api-types/v9";
import React, { useMemo } from "react";
import useSWR from "swr";

export default function Guild(){
  const { data, error, isLoading } = useSWR<RESTGetAPICurrentUserGuildsResult>(Routes.userGuilds());
  const ownerGuildCount = useMemo(() => data?.filter(g => g.owner).length, [data]);

  return (
    <SWRSuspense data={data} error={error} isLoading={isLoading}>
      <div>
        <h3>概要</h3>
        <div className="scrollx">
          <table>
            <thead>
              <tr>
                <th>データ名</th>
                <th>データ値</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>サーバー数</td>
                <td>{data?.length}</td>
              </tr>
              <tr>
                <td>所有サーバー数</td>
                <td>{ownerGuildCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <DetailedGuildInfoContainer guilds={data!} />
    </SWRSuspense>
  );
}
