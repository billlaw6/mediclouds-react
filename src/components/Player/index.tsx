import React, { FunctionComponent, useState } from "react";

import { PlayerPropsI } from "./types";

import "./style.less";
import Tools from "./components/Tools";
import Viewport from "./components/Viewport";
import Header from "./components/Header";

const Player: FunctionComponent<PlayerPropsI> = (props) => {
  const { id, defaultFrame, defaultSeries } = props;

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
