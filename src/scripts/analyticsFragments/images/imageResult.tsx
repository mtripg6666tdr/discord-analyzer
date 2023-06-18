import React, { useEffect, useState } from "react";

type Props = {
  url: string,
};

export default function ImageResult(props: Props){
  const [blobUrl, setBlobUrl] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abortController: AbortController | null = new window.AbortController();
    let _blobUrl: string | null = null;
    setBlobUrl(undefined);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try{
        const res = await window.fetch(props.url, { signal: abortController.signal });
        abortController = null;
        if(!res.ok){
          setError(`問題が発生しました。ステータス: ${res.status}`);
          return;
        }
        const bufs = await res.arrayBuffer();
        const blob = new Blob([bufs], { type: res.headers.get("content-type") || "application/ocset-stream" });
        setBlobUrl(_blobUrl = URL.createObjectURL(blob));
        // console.log("object url created.");
      }
      catch(er){
        setError(`問題が発生しました。${
          er && typeof er === "object" && "message" in er ? er.message as string : Object.prototype.toString.call(er)
        }`);
      }
    })();

    return () => {
      if(abortController){
        abortController.abort();
      }
      if(_blobUrl){
        URL.revokeObjectURL(_blobUrl);
        // console.log("object url released.");
      }
    };
  }, [props.url]);

  return (
    <>
      <div className="image_preview">
        <div>
          {
            blobUrl
              ? <img src={blobUrl} alt="作成結果" />
              : error
                ? <span>エラーが発生しました。他の形式やサイズをお試しください。</span>
                : <span>読み込み中...</span>
          }
        </div>
      </div>
      <br />
      <a href={props.url} target="_blank" rel="noreferrer noopener">
        <button type="button">画像を開く</button>
      </a>
      <p>ダウンロードは、上のボタンで画像を開いてから行えます。</p>
    </>
  );
}
