import React, { useEffect, useMemo } from "react";

export default function Top(){
  const state = useMemo(() => window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16), []);

  useEffect(() => {
    window.localStorage.setItem("__oauth_state", state);
  }, [state]);

  return (
    <>
      <div className="narrow">
        <p>Discordアカウントでログインして、参加しているサーバーに関する生の情報をAPIから呼び出して表示できます。</p>
        <p>Discordアカウントでのログイン情報はこのサイトのサーバーには送信されず、ブラウザで処理されます。</p>
        <form action="https://discord.com/oauth2/authorize">
          <input type="hidden" name="response_type" value="token" />
          <input type="hidden" name="client_id" value={process.env.CLIENT_ID} />
          <input type="hidden" name="state" value={state} />
          <input type="hidden" name="scope" value="identify guilds" />
          <input type="hidden" name="redirect_uri" value={process.env.APP_URL} />
          <button type="submit">Discordアカウントでログイン</button>
        </form>
        <div>
          <div className="note">
            <span className="legend">お知らせ</span>
            <span>
              何かいいアイコンを募集中です！提案があれば
              <a
                href="https://twitter.com/mtripg6666tdr"
                target="_blank"
                rel="noreferrer noopener"
                className="white">Twitter</a>
                とかDiscordとかで教えてください！
            </span>
          </div>
        </div>
        <div className="border-top">
          <h2>仕組み</h2>
          <p>
            上のボタンを押すと、Discordの画面へ移動します。
            ログインし、認証が完了すると、Discordから、このサイトのための認証情報が送信され、
            その認証情報を使ってブラウザからDiscordに情報を問い合わせて、それを表示します。
          </p>
        </div>
        <div className="border-top">
          <h2>注意点</h2>
          <p>
            <a
              href="https://discord.com/developers/docs/topics/oauth2#implicit-grant"
              target="_blank"
              rel="noreferrer noopener"
              className="white">
              暗黙的なOAuth2許可
            </a>
            (The implicit OAuth2 grant)という、シンプルな認証フローを使用しているため、
            あなたの認証情報やユーザー情報などは、このサイトのサーバーには一切送信されませんが、
            認証時に認証情報がURLとして取得されるという特徴があるため、共用端末などでの使用は推奨しません。
            ご自身が所有している端末をご利用いただくことを推奨します。
          </p>
        </div>
        <div className="border-top">
          <h2>利用規約</h2>
          <p>このサービスを利用する際の利用規約を以下に示します。</p>
          <h3>免責事項</h3>
          <p>
            このサービスは、現状有姿で維持・公開されており、
            常に便利で使いやすいものになるように努力していますが、
            このサービスをご利用いただいたことによるあらゆる損害・損壊等に対して、
            当サイトの制作者を含むあらゆる関係者は責任を負いかねます。
          </p>
          <h3>禁止事項</h3>
          <p>
            以下に挙げる各行為等を禁止します。
            いずれかに違反したと判断された場合、サイトへのアクセスを遮断させていただくことがあります。
          </p>
          <ul style={{ textAlign: "left" }}>
            <li>当サイトのバグ等利用するなどの悪質な行為</li>
            <li>サイトに対する、プログラム等を使用した過剰なアクセス</li>
            <li>他人のDiscordアカウントを使って認証する行為</li>
            <li>公序良俗に反する行為</li>
            <li>その他、当サイトの制作者や管理者が不適切と判断する行為</li>
          </ul>
        </div>
        <div className="border-top border-bottom">
          <h2>ソースコード</h2>
          <p>
            ソースコードは
            <a
              href="https://github.com/mtripg6666tdr/discord-analyzer"
              target="_blank"
              rel="noreferrer noopener"
              className="white"
            >こちら</a>
          </p>
        </div>
      </div>
    </>
  );
}
