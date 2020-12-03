import React, { FunctionComponent, useEffect, useState } from "react";

import { CollectionMapT, PlayerPropsI } from "./types";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";
import initialization from "./methods/initialization";

import { useCornerstone } from "./hooks/useCornerstone";
import useData from "./hooks/useData";

import "./style.less";
import { getActiveCollections } from "./helpers";
import useWindows from "./hooks/useWindows";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { exams } = props;
  const {
    initCs,
    initCst,
    collectionMap,
    initCsImgLoader,
    updateCollectionMap,
    getCurrentDatas,
  } = useData();
  const { cornerstone, cornerstoneTools, cornerstoneWADOImageLoader } = useCornerstone();
  const { openWindow } = useWindows();

  useEffect(() => {
    initCs(cornerstone);
    initCsImgLoader(cornerstoneWADOImageLoader);

    initialization({ cs: cornerstone, csImgLoader: cornerstoneWADOImageLoader, exams })
      .then((res) => {
        const currentDatas = getCurrentDatas(res);

        if (!currentDatas) {
          openWindow();
        } else {
          currentDatas.forEach((item) => {
            const { frame } = item;

            openWindow({ data: item, frame, active: true });
          });
        }

        updateCollectionMap(res);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div id="player">
      <Header></Header>
      <div className="player-content">
        <Viewport></Viewport>
      </div>
      <Tools></Tools>
    </div>
  );
};

export default Player;
