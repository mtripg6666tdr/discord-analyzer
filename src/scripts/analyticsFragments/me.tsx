import type { RESTGetAPICurrentUserResult } from "discord-api-types/v9";

import SWRSuspense from "../components/swrSuspense";
import { getFlagList, getTimeStampFromSnowflake, timestampToString } from "../util";

import { Routes } from "discord-api-types/v9";
import React from "react";
import useSWR from "swr";


export default function Me(){
  const { data, error, isLoading } = useSWR<RESTGetAPICurrentUserResult>(Routes.user());

  return (
    <SWRSuspense data={data} error={error} isLoading={isLoading}>
      <h3>ユーザー情報</h3>
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
              <td>ユーザー名</td>
              <td>{data?.username}</td>
            </tr>
            <tr>
              <td>グローバルユーザ名</td>
              <td>{data?.global_name}</td>
            </tr>
            <tr>
              <td>識別子</td>
              <td>{data?.discriminator === "0" ? "なし" : data?.discriminator}</td>
            </tr>
            <tr>
              <td>ユーザーID</td>
              <td>{data?.id}</td>
            </tr>
            <tr>
              <td>アカウント作成日時</td>
              <td>{data?.id && timestampToString(getTimeStampFromSnowflake(data?.id))}</td>
            </tr>
            <tr>
              <td>多要素認証</td>
              <td>{data?.mfa_enabled ? "はい" : "いいえ"}</td>
            </tr>
            <tr>
              <td>定期購読</td>
              <td>
                {
                  data?.premium_type === 0
                    ? "なし"
                    : data?.premium_type === 1
                      ? "Nitro Classic"
                      : data?.premium_type === 2
                        ? "Nitro"
                        : data?.premium_type === 3
                          ? "Nitro Basic"
                          : "不明"
                }
              </td>
            </tr>
            <tr>
              <td>アクセントカラー</td>
              <td>
                {
                  data?.accent_color
                    ? (
                      <>
                        <span className="color_sample" style={{ backgroundColor: `#${data?.accent_color.toString(16)}` }} />
                        #{data?.accent_color.toString(16)}
                      </>
                    )
                    : "なし"
                }
              </td>
            </tr>
            <tr>
              <td>ロケール</td>
              <td>{data?.locale}</td>
            </tr>
            <tr>
              <td>アバターハッシュ</td>
              <td>{data?.avatar || "なし"}</td>
            </tr>
            <tr>
              <td>バナーハッシュ</td>
              <td>{data?.banner || "なし"}</td>
            </tr>
            <tr>
              <td>フラグ</td>
              <td>{data?.flags}</td>
            </tr>
            <tr>
              <td>フラグの内容</td>
              <td>
                <ul style={{ textAlign: "left" }}>
                  {
                    data?.flags && getFlagList(data?.flags).map(name => <li key={name}>{name}</li>)
                  }
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul className="centered">
        <li>アバター、バナーは画像URL作成タブで形式とサイズを指定して画像のURLを取得できます。</li>
        <li>フラグは、OAuthでないDiscordのユーザーのトークンで取得できる内容と異なる場合があります。</li>
      </ul>
    </SWRSuspense>
  );
}
