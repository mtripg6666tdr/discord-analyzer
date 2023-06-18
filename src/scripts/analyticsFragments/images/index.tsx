import type { RESTGetAPICurrentUserResult } from "discord-api-types/v9";

import EmojiInput from "./emojiInput";
import GuildInput from "./guildInput";
import UserImageInput from "./userImageInput";
import SWRSuspense from "../../components/swrSuspense";

import { ImageFormat, Routes } from "discord-api-types/v9";
import React, { useCallback, useMemo, useState } from "react";
import useSWR from "swr";


type ImageType = "avatar" | "banner" | "guild" | "guildbanner" | "splash" | "emoji";

export default function Images(){
  const { data, error, isLoading } = useSWR<RESTGetAPICurrentUserResult>(Routes.user());
  const [imageType, setImageType] = useState<ImageType>("avatar");
  const [imageFormat, setImageFormat] = useState<ImageFormat>(ImageFormat.PNG);

  const onTypeChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.checked){
      // if(e.target.value === "splash" && imageFormat === ImageFormat.GIF){
      //   setImageFormat(ImageFormat.PNG);
      // }
      setImageType(e.target.value as ImageType);
    }
  }, []);

  const onFormatChanged = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked && setImageFormat(ImageFormat[e.target.value as keyof typeof ImageFormat]);
  }, []);

  const imageSizes = useMemo(() => Array.from({ length: 9 }, (_, i) => 2 ** (i + 4)), []);
  const [imageSize, setImageSize] = useState<number>(16);
  const onImageSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageSize(Number(e.target.value));
  }, []);

  return (
    <SWRSuspense data={data} error={error} isLoading={isLoading}>
      <div className="form">
        <div>
          <p>画像の種類</p>
          <label>
            <input type="radio" name="type" value="avatar" onChange={onTypeChanged} defaultChecked />
            <span>アバター</span>
          </label>
          <label>
            <input type="radio" name="type" value="banner" onChange={onTypeChanged} disabled={!data?.banner} />
            <span>バナー</span>
          </label>
          <label>
            <input type="radio" name="type" value="guild" onChange={onTypeChanged} />
            <span>サーバーアイコン</span>
          </label>
          <label>
            <input type="radio" name="type" value="emoji" onChange={onTypeChanged} />
            <span>カスタム絵文字</span>
          </label>
        </div>
        <div>
          <p>画像の形式（フォーマット）</p>
          {
            (["PNG", "JPEG", "WebP", imageType !== "splash" && "GIF"].filter(Boolean) as string[]).map((type) => (
              <label key={type}>
                <input
                  type="radio"
                  name="format"
                  value={type}
                  onChange={onFormatChanged}
                  checked={ImageFormat[type as keyof typeof ImageFormat] === imageFormat}
                />
                <span>{type}</span>
              </label>
            ))
          }
        </div>
        <div>
          <label>
            <p>画像のサイズ</p>
            <select value={imageSize} onChange={onImageSizeChange}>
              {
                imageSizes.map(size => (
                  <option value={size} key={size}>{size}px</option>
                ))
              }
            </select>
          </label>
        </div>
      </div>
      {
        (imageType === "avatar" || imageType === "banner")
          ? <UserImageInput type={imageType} format={imageFormat} size={imageSize} user={data!} />
          : imageType === "emoji"
            ? <EmojiInput format={imageFormat} size={imageSize} />
            : imageType === "guild"
              ? <GuildInput format={imageFormat} size={imageSize} />
              : null
      }
    </SWRSuspense>
  );
}
