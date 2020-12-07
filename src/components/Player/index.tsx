import React, { FunctionComponent, useEffect } from "react";

import { PlayerPropsI } from "./types";

import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";

import useData from "./hooks/useData";
import useWindows from "./hooks/useWindows";

import "./style.less";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { exams } = props;

  const { init } = useData();
  const { openWindow } = useWindows();

  useEffect(() => {
    init(exams).then(() => {
      console.log("INIT SUCCESSED");
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
