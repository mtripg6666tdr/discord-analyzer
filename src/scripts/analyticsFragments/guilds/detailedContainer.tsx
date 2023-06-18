import type { RESTAPIPartialCurrentUserGuild, RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v9";

import { getPermissionList, getTimeStampFromSnowflake, timestampToString } from "../../util";

import React, { useCallback, useState } from "react";

type Props = {
  guilds: RESTGetAPICurrentUserGuildsResult,
};

export default function DetailedGuildInfoContainer(props: Props){
  const [guildId, setGuildId] = useState<string>("");
  const [error, setError] = useState<string>();
  const [detailedGuild, setDetailedGuild] = useState<RESTAPIPartialCurrentUserGuild>();

  const changeGuild = useCallback((guild?: RESTAPIPartialCurrentUserGuild) => {
    setDetailedGuild(guild);
    if(!guild){
      setError("サーバーがみつかりませんでした。");
    }else{
      setError("");
    }
  }, []);

  const onGuildSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuildId(e.target.value);
    const guild = props.guilds.find(g => g.id === e.target.value);
    changeGuild(guild);
  }, [changeGuild, props.guilds]);

  const onGuildIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGuildId(e.target.value), []);

  const onSubmit = useCallback((e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const guild = props.guilds.find(g => g.id === guildId);
    changeGuild(guild);
    return false;
  }, [changeGuild, guildId, props.guilds]);

  return (
    <div>
      <h3>サーバーごとの情報</h3>
      <form onSubmit={onSubmit}>
        <div>
          <p>以下からサーバーを選択</p>
          <select name="guild_selection" onChange={onGuildSelectionChange} value={guildId}>
            <option value="">選択...</option>
            {
              props.guilds.map(guild => <option key={guild.id} value={guild.id}>{guild.name}</option>)
            }
          </select>
        </div>
        <div>
          <p>または、IDを直接入力</p>
          <input type="text" pattern="^\d+$" name="guild" placeholder="01234567890123" onChange={onGuildIdChange} value={guildId} required />
        </div>
        <button type="submit" className="vspacing">表示</button>
      </form>
      {
        detailedGuild && (
          <>
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
                    <td>名称</td>
                    <td>{detailedGuild.name}</td>
                  </tr>
                  <tr>
                    <td>サーバーID</td>
                    <td>{detailedGuild.id}</td>
                  </tr>
                  <tr>
                    <td>サーバー作成日時</td>
                    <td>{timestampToString(getTimeStampFromSnowflake(detailedGuild.id))}</td>
                  </tr>
                  <tr>
                    <td>アイコンハッシュ</td>
                    <td>{detailedGuild.icon}</td>
                  </tr>
                  <tr>
                    <td>サーバー機能</td>
                    <td>
                      {
                        detailedGuild.features.length > 0
                          ? (
                            <ul style={{ textAlign: "left" }}>
                              {
                                detailedGuild.features.map(feature => <li key={feature}>{feature}</li>)
                              }
                            </ul>
                          ) : "なし"
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>権限フラグ</td>
                    <td>{detailedGuild.permissions}</td>
                  </tr>
                  <tr>
                    <td>与えられている権限</td>
                    <td>
                      <ul style={{ textAlign: "left" }}>
                        {
                          getPermissionList(BigInt(detailedGuild.permissions)).map(name => (
                            <li key={name}>{name}</li>
                          ))
                        }
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )
      }
      {
        error && <span>{error}</span>
      }
    </div>
  );
}
