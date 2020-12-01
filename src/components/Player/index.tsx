import React, { FunctionComponent, useEffect } from "react";

import { PlayerPropsI } from "./types";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";
import initialization from "./methods/initialization";

import { useCornerstone } from "./hooks/useCornerstone";
import useData from "./hooks/useData";

import "./style.less";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { id, defaultSeries, defaultFrame = 0 } = props;
  const { initCs, initCst, updateReducer } = useData();
  const { cornerstone, cornerstoneTools } = useCornerstone();

  /** 初始化 */
  useEffect(() => {
    initCs(cornerstone);
    initCst(cornerstoneTools);
    initialization({
      examId: id,
      cs: cornerstone,
      defaultFrame,
      defaultSeriesId: defaultSeries,
    })
      .then((res) => {
        updateReducer(res);
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
