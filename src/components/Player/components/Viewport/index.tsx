import React, { FunctionComponent, ReactNode, useEffect, useRef } from "react";
import useData from "_components/Player/hooks/useData";
import useStatus from "_components/Player/hooks/useStatus";
import useWindows from "_components/Player/hooks/useWindows";
import draw from "_components/Player/methods/draw";
import { CollectionMapT } from "_components/Player/types";
import SidePan from "../SidePan";
import Win from "../Win";

import "./style.less";

interface ViewportPropsI {
  collectionMap?: CollectionMapT;
}

const Viewport: FunctionComponent = () => {
  const { windowsMap } = useWindows();

  const getWindows = (): ReactNode => {
    if (!windowsMap) return null;

    const renderArr: ReactNode[] = [];
    windowsMap.forEach((item, index) => {
      const { data } = item;
      const key = data ? `${data.id}` : `${Date.now()}`;

      return renderArr.push(<Win key={key} index={index} data={item}></Win>);
    });

    return renderArr;
  };

  return (
    <div id="viewport">
      <SidePan location="left"></SidePan>
      {getWindows()}
      <SidePan location="right"></SidePan>
    </div>
  );
};

export default Viewport;
