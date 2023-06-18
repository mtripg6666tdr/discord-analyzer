import type { ImageFormat, RESTGetAPICurrentUserResult, UserAvatarFormat } from "discord-api-types/v9";

import ImageResult from "./imageResult";

import { CDNRoutes, RouteBases } from "discord-api-types/v9";
import React, { useCallback, useState } from "react";


type Props = {
  type: "avatar" | "banner",
  format: ImageFormat,
  size: number,
  user: RESTGetAPICurrentUserResult,
};

export default function UserImageInput(props: Props){
  const [targetIsMe, setTargetIsMe] = useState<boolean>(true);
  const changeTarget = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTargetIsMe(e.target.value === "me"), []);

  const [uid, setUid] = useState<string | null>(null);
  const changeUid = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUid(e.target.value), []);
  const [uhash, setUhash] = useState<string | null>(null);
  const changeUhash = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setUhash(e.target.value), []);

  const [resultUrl, setResultUrl] = useState<string>();

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${RouteBases.cdn}${
      CDNRoutes[`user${props.type === "avatar" ? "Avatar" : "Banner"}`](
        targetIsMe ? props.user?.id : uid!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        targetIsMe ? props.user?.avatar! : uhash!,
        props.format as UserAvatarFormat
      )
    }?size=${props.size}`;
    setResultUrl(url);
    return false;
  }, [props.type, props.user?.id, props.user?.avatar, props.format, props.size, targetIsMe, uid, uhash]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <p>画像の生成対象</p>
          <label>
            <input type="radio" name="target" value="me" onChange={changeTarget} disabled={!props.user.avatar} defaultChecked />
            <span>自分</span>
          </label>
          <label>
            <input type="radio" name="target" value="other" onChange={changeTarget} />
            <span>他人</span>
          </label>
        </div>
        {
          !targetIsMe && (
            <>
              <div>
                <label>
                  <p>ユーザーID</p>
                  <input type="text" name="uid" placeholder="1234567890123" size={48} pattern="^\d+$" onChange={changeUid} required />
                </label>
              </div>
              <div>
                <label>
                  <p>ハッシュ</p>
                  <input type="text" name="uid" onChange={changeUhash} size={48} pattern="^[abcdef_\d]+$" required />
                </label>
              </div>
            </>
          )
        }
        <button className="vspacing" type="submit">作成</button>
      </form>
      {resultUrl && (
        <ImageResult url={resultUrl} />
      )}
    </>
  );
}
