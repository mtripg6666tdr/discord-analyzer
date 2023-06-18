import type { GuildIconFormat, ImageFormat, RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v9";

import ImageResult from "./imageResult";
import SWRSuspense from "../../components/swrSuspense";

import { CDNRoutes, RouteBases, Routes } from "discord-api-types/v9";
import React, { useCallback, useState } from "react";
import useSWR from "swr";


type Props = {
  format: ImageFormat,
  size: number,
};

export default function GuildInput(props: Props){
  const { data, error, isLoading } = useSWR<RESTGetAPICurrentUserGuildsResult>(Routes.userGuilds());
  const [targetIsInMine, setTargetIsInMine] = useState<boolean>(true);
  const onTargetChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked){
      setTargetIsInMine(e.target.value === "me");
      setGuildId("");
      setGuildHash("");
    }
  }, []);
  const [guildId, setGuildId] = useState<string>("");
  const onGuildIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGuildId(e.target.value), []);
  const [guildHash, setGuildHash] = useState<string>("");
  const onGuildHashChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGuildHash(e.target.value), []);
  const onGuildSelectionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGuildId = e.target.value;
    if(newGuildId){
      setGuildId(newGuildId);
      setGuildHash(data!.find(guild => guild.id === newGuildId)!.icon!);
    }else{
      setGuildId("");
      setGuildHash("");
    }
  }, [data]);
  const [imageUrl, setImageUrl] = useState<string>();
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImageUrl(`${RouteBases.cdn}/${CDNRoutes.guildIcon(guildId, guildHash, props.format as GuildIconFormat)}?size=${props.size}`);
    return false;
  }, [props.format, props.size, guildId, guildHash]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <p>画像の生成対象</p>
          <label>
            <input type="radio" name="target" value="me" onChange={onTargetChange} checked={targetIsInMine} />
            <span>参加サーバーから選択</span>
          </label>
          <label>
            <input type="radio" name="target" value="other" onChange={onTargetChange} checked={!targetIsInMine} />
            <span>自分で情報を指定</span>
          </label>
        </div>
        {
          targetIsInMine ? (
            <div>
              <SWRSuspense data={data} error={error} isLoading={isLoading}>
                <select value={guildId} onChange={onGuildSelectionChange} required>
                  <option value={""}>選択</option>
                  {
                    data?.map(guild => <option key={guild.id} value={guild.id}>{guild.name}</option>)
                  }
                </select>
              </SWRSuspense>
            </div>
          ) : (
            <>
              <div>
                <label>
                  <p>サーバーID</p>
                  <input type="text" pattern="^\d+$" name="guildId" placeholder="1234567890123" size={48} onChange={onGuildIdChange} value={guildId} required />
                </label>
                <label>
                  <p>アイコンハッシュ</p>
                  <input type="text" pattern="^[\dabcdef_]+$" name="hash" size={48} onChange={onGuildHashChange} value={guildHash} required />
                </label>
              </div>
            </>
          )
        }
        <button type="submit" className="vspacing">作成</button>
      </form>
      {
        imageUrl && (
          <ImageResult url={imageUrl} />
        )
      }
    </>
  );
}
