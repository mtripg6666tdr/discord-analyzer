import type { EmojiFormat, ImageFormat } from "discord-api-types/v9";

import ImageResult from "./imageResult";

import { CDNRoutes, RouteBases } from "discord-api-types/v9";
import React, { useCallback, useState } from "react";


type Props = {
  format: ImageFormat,
  size: number,
};

export default function EmojiInput(props: Props){
  const [emojiUrl, setEmojiUrl] = useState<string>("");
  const [emojiID, setEmojiID] = useState<string>("");
  const onIdChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmojiID(e.target.value), []);
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmojiUrl(`${RouteBases.cdn}${CDNRoutes.emoji(emojiID, props.format as EmojiFormat)}`);
    return false;
  }, [emojiID, props.format]);

  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <p>絵文字ID</p>
          <input type="text" name="id" placeholder="0123456789123" onChange={onIdChange} required />
        </div>
        <button className="vspacing" type="submit">作成</button>
      </form>
      {
        emojiUrl && (
          <ImageResult url={emojiUrl} />
        )
      }
    </>
  );
}
