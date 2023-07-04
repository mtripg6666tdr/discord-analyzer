import Analytics from "./analytics";
import ErrorFragment from "./error";
import Top from "./top";

import CryptoAES from "crypto-js/aes";
import CryptoEncUtf8 from "crypto-js/enc-utf8";
import React, { useCallback, useLayoutEffect, useState } from "react";

export default function Router(){
  const [queryParams, setQueryParams] = useState<URLSearchParams>();
  const [prevState, setPrevState] = useState<string>();

  useLayoutEffect(() => {
    try{
      let hash: string = window.location.hash.substring(1);
      if(hash){
        window.localStorage.setItem("__discord_obtained_at", Date.now().toString());
        window.location.hash = "";
      }else{
        hash = window.localStorage.getItem("__discord_hash") || "";
        if(hash){
          hash = CryptoAES.decrypt(hash, process.env.SECRET!).toString(CryptoEncUtf8);
        }
      }
      let currentQueryParams = new URLSearchParams(hash);
      if(Date.now() - ((Number(window.localStorage.getItem("__discord_obtained_at")) || 0) + (Number(currentQueryParams.get("expires_in")) || 0) * 1000) > 0){
        hash = "";
        currentQueryParams = new URLSearchParams();
      }
      window.localStorage.setItem("__discord_hash", CryptoAES.encrypt(hash, process.env.SECRET!).toString());
      setQueryParams(currentQueryParams);
      setPrevState(window.localStorage.getItem("__oauth_state") || "");
    }
    catch{
      setQueryParams(new URLSearchParams());
      setPrevState("");
    }
  }, []);

  const logout = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    (e.target as HTMLButtonElement).disabled = true;
    (e.target as HTMLButtonElement).textContent = "ログアウト中...";
    window.localStorage.removeItem("__discord_hash");
    window.localStorage.removeItem("__oauth_state");
    window.localStorage.removeItem("__discord_obtained_at");
    window.location.hash = "";
    window.location.reload();
  }, []);

  if(["token_type", "access_token", "state"].every(key => queryParams?.has(key)) && queryParams?.get("state") === prevState){
    return (
      <>
        <button type="button" className="logout" onClick={logout}>ログアウト</button>
        <Analytics
          tokenType={queryParams!.get("token_type")!}
          accessToken={queryParams!.get("access_token")!}
        />
      </>
    );
  }else if(queryParams){
    return (
      <>
        {queryParams?.get("state") && (<><ErrorFragment /><hr /></>)}
        <Top />
      </>
    );
  }else{
    return "Loading...";
  }
}
