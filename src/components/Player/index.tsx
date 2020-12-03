import React, { FunctionComponent, useEffect, useState } from "react";

import { CollectionMapT, PlayerPropsI } from "./types";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";
import initialization from "./methods/initialization";

import { useCornerstone } from "./hooks/useCornerstone";
import useData from "./hooks/useData";

import "./style.less";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { exams } = props;
  const { initCs, initCst, collectionMap, initCsImgLoader, updateCollectionMap } = useData();
  const { cornerstone, cornerstoneTools, cornerstoneWADOImageLoader } = useCornerstone();

  useEffect(() => {
    initCs(cornerstone);
    initCsImgLoader(cornerstoneWADOImageLoader);

    initialization({ cs: cornerstone, csImgLoader: cornerstoneWADOImageLoader, exams })
      .then((res) => {
        console.log("res", res);
        updateCollectionMap(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div id="player">
      <Header></Header>
      <div className="player-content">
        <Viewport collectionMap={collectionMap}></Viewport>
      </div>
      <Tools></Tools>
    </div>
  );
};

export default Player;
