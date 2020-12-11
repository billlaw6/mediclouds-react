import React, { FunctionComponent, useEffect } from "react";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";

import useData from "./hooks/useData";
import useWindows from "./hooks/useWindows";

import { PlayerPropsI } from "./types/common";

import "./style.less";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { exams } = props;

  const { initPlayerExamMap, playerExamMap } = useData();
  const { initWindows, windowsMap } = useWindows();

  useEffect(() => {
    initPlayerExamMap(exams)
      .then((res) => {
        initWindows(exams, res);
        console.log("INIT SUCCESSED");
      })
      .catch((err) => {
        console.error("INIT FAILD", err);
      });
  }, []);

  return (
    <div id="player">
      <Header></Header>
      <Tools></Tools>
      <div className="player-content">
        <Viewport></Viewport>
      </div>
    </div>
  );
};

export default Player;
