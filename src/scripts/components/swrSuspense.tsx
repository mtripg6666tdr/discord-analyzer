import ErrorFragment from "../error";

import React from "react";

type Props = {
  data: any,
  children: React.ReactNode,
  isLoading: boolean,
  error: any,
};

export default function SWRSuspense(props: Props){
  if(props.data){
    return props.children;
  }else if(props.isLoading){
    return "読み込み中...";
  }else if(props.error){
    return (
      <>
        <ErrorFragment />
        <a href="/">トップに戻る</a>
      </>
    );
  }
}
